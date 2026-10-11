"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import config from "@/config";
import { runCommand } from "@/app/lib/commands";

interface HistoryEntry {
  id: number;
  command: string;
  output: ReactNode;
}

export default function Terminal() {
  const [bootedLines, setBootedLines] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState("");
  const [crtOn, setCrtOn] = useState(config.theme.crtDefaultOn);
  const [pastCommands, setPastCommands] = useState<string[]>([]);
  const [historyCursor, setHistoryCursor] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);

  const booted = bootedLines >= config.boot.length;

  // Reveal boot lines one at a time, then hand control to the prompt.
  useEffect(() => {
    if (booted) return;
    const delay = bootedLines === 0 ? 300 : 120;
    const t = setTimeout(() => setBootedLines((n) => n + 1), delay);
    return () => clearTimeout(t);
  }, [bootedLines, booted]);

  useEffect(() => {
    if (booted) inputRef.current?.focus();
  }, [booted]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [history, bootedLines]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    setInput("");
    setHistoryCursor(null);
    if (!trimmed) return;

    const allCommands = [...pastCommands, trimmed];
    setPastCommands(allCommands);

    let cleared = false;
    const output = runCommand(trimmed, {
      crtOn,
      toggleCrt: () => setCrtOn((v) => !v),
      clear: () => {
        cleared = true;
        setHistory([]);
      },
      pastCommands: allCommands,
    });

    if (cleared) return;

    setHistory((h) => [
      ...h,
      { id: idCounter.current++, command: trimmed, output },
    ]);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (pastCommands.length === 0) return;
      const next =
        historyCursor === null
          ? pastCommands.length - 1
          : Math.max(0, historyCursor - 1);
      setHistoryCursor(next);
      setInput(pastCommands[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyCursor === null) return;
      const next = historyCursor + 1;
      if (next >= pastCommands.length) {
        setHistoryCursor(null);
        setInput("");
      } else {
        setHistoryCursor(next);
        setInput(pastCommands[next]);
      }
    }
  }

  const prompt = `${config.identity.handle}@${config.identity.host}:~$`;

  const themeStyle = {
    "--term-accent": config.theme.accent,
    "--term-accent-dim": config.theme.accentDim,
    "--term-bg": config.theme.background,
  } as CSSProperties;

  return (
    <div
      className={`crt-screen ${crtOn ? "crt-on" : ""} h-dvh w-full flex flex-col overflow-hidden`}
      style={themeStyle}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("a, button, input") && !window.getSelection()?.toString()) inputRef.current?.focus();
      }}
    >
      <div className="crt-flicker flex-1 flex flex-col min-h-0">
        <div
          className="flex-1 min-h-0 overflow-y-auto break-words px-4 pt-6 pb-16 sm:px-8 md:px-16 max-w-5xl mx-auto w-full"
          aria-live="polite"
        >
          <div>
            {config.boot.slice(0, bootedLines).map((line, i) => (
              <div key={i} className="text-term-dim">
                {line || " "}
              </div>
            ))}
          </div>

          {booted && (
            <div className="mt-2">
              {history.map((entry) => (
                <div key={entry.id} className="mb-3">
                  <div>
                    <span className="text-term-accent">{prompt}</span>{" "}
                    {entry.command}
                  </div>
                  {entry.output}
                </div>
              ))}

              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2"
              >
                <label
                  htmlFor="terminal-input"
                  className="text-term-accent shrink-0"
                >
                  {prompt}
                </label>
                <input
                  id="terminal-input"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                  className="flex-1 min-w-0 bg-transparent outline-none border-none text-term-accent caret-term-accent"
                  aria-label="terminal input"
                />
              </form>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setCrtOn((v) => !v);
        }}
        className="fixed bottom-3 right-3 text-xs px-2 py-1 border border-term-dim text-term-dim hover:text-term-accent hover:border-term-accent transition-colors"
      >
        [ CRT: {crtOn ? "ON" : "OFF"} ]
      </button>
    </div>
  );
}
