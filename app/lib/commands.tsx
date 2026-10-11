import type { ReactNode } from "react";
import config from "@/config";

const assetPath = (file: string) => `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/${file}`;

export interface CommandContext {
  crtOn: boolean;
  toggleCrt: () => void;
  clear: () => void;
  /** Every command submitted so far, including the current one. */
  pastCommands: string[];
}

interface Command {
  description: string;
  /** Return the lines to print, or null if the command doesn't print output. */
  run: (args: string[], ctx: CommandContext) => ReactNode;
}

function Line({ children, dim }: { children: ReactNode; dim?: boolean }) {
  return <div className={dim ? "text-term-dim" : undefined}>{children}</div>;
}

function Heading({ children }: { children: ReactNode }) {
  return <div className="text-term-accent font-bold mt-1">{children}</div>;
}

// filename -> command shown by `ls`, opened by `cat <file>`
const FILES: Record<string, string> = {
  "about.txt": "about",
  "experiences.txt": "experiences",
  "projects.txt": "projects",
  "contact.txt": "contact",
};

const commands: Record<string, Command> = {
  help: {
    description: "list available commands",
    run: () => (
      <div>
        <Line>available commands:</Line>
        {Object.entries(commands)
          .map(([name, cmd]) => (
            <Line key={name}>
              {"  "}
              <span className="text-term-accent inline-block w-32">{name}</span>
              <span className="text-term-dim">{cmd.description}</span>
            </Line>
          ))}
      </div>
    ),
  },

  about: {
    description: "who I am",
    run: () => (
      <div>
        <Heading>ABOUT</Heading>
        <img src={assetPath("headshot.jpeg")} alt="Rongyang Ye smiling" width={132} height={150} className="my-3 rounded border border-term-dim object-cover grayscale" />
        {config.about.map((line, i) => (
          <Line key={i} dim={line === ""}>
            {line || " "}
          </Line>
        ))}
      </div>
    ),
  },

  resume: {
    description: "download my résumé (PDF)",
    run: () => <Line><a href={assetPath("Rongyang_Ye.pdf")} download className="underline">Download Rongyang Ye's résumé (PDF)</a></Line>,
  },

  experiences: {
    description: "where I've worked",
    run: () => (
      <div>
        <Heading>EXPERIENCE</Heading>
        {config.experiences.map((exp, i) => (
          <div key={i} className="mt-2">
            <Line>
              <span className="text-term-accent">{exp.role}</span>
              {" @ "}
              <span>{exp.org}</span>
            </Line>
            <Line dim>
              {exp.period}
              {exp.location ? ` -- ${exp.location}` : ""}
            </Line>
            {exp.bullets.map((b, j) => (
              <Line key={j}>{"  * " + b}</Line>
            ))}
          </div>
        ))}
      </div>
    ),
  },

  projects: {
    description: "things I've built",
    run: (args) => {
      const index = Number(args[0]);
      const list =
        !Number.isNaN(index) && config.projects[index - 1]
          ? [config.projects[index - 1]]
          : config.projects;

      return (
        <div>
          <Heading>PROJECTS</Heading>
          {list.map((p, i) => (
            <div key={i} className="mt-2">
              <Line>
                <span className="text-term-accent">
                  [{config.projects.indexOf(p) + 1}] {p.name}
                </span>
                {p.status && <span className="text-term-dim"> {`[${p.status}]`}</span>}
              </Line>
              <Line>{"  " + p.description}</Line>
              <Line dim>{"  tech: " + p.tech.join(", ")}</Line>
              {p.links?.map((link, j) => (
                <Line key={j}>
                  {"  "}
                  <a
                    className="underline hover:text-term-accent"
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}: {link.url}
                  </a>
                </Line>
              ))}
            </div>
          ))}
          {list.length > 1 && (
            <Line dim>{"\ntip: 'projects <n>' to view one project"}</Line>
          )}
        </div>
      );
    },
  },

  contact: {
    description: "how to reach me",
    run: () => (
      <div>
        <Heading>CONTACT</Heading>
        <Line>
          email:{" "}
          <a className="underline hover:text-term-accent" href={`mailto:${config.contact.email}`}>
            {config.contact.email}
          </a>
        </Line>
        {config.contact.links.map((link, i) => (
          <Line key={i}>
            {link.label.toLowerCase()}:{" "}
            <a
              className="underline hover:text-term-accent"
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.url}
            </a>
          </Line>
        ))}
      </div>
    ),
  },

  whoami: {
    description: "print identity",
    run: () => (
      <div>
        <Line>{config.identity.name}</Line>
        <Line dim>{config.identity.role}</Line>
        <Line dim>{config.identity.tagline}</Line>
        <Line dim>{config.identity.location}</Line>
      </div>
    ),
  },

  ls: {
    description: "list sections",
    run: () => <Line>{Object.keys(FILES).join("  ")}</Line>,
  },

  cat: {
    description: "print a file, e.g. 'cat about.txt'",
    run: (args, ctx) => {
      const file = args[0];
      if (!file) return <Line dim>usage: cat &lt;file&gt;</Line>;

      const target = Object.hasOwn(FILES, file) ? FILES[file] : undefined;
      if (!target) {
        return <Line>cat: {file}: No such file or directory</Line>;
      }
      return commands[target].run([], ctx);
    },
  },

  pwd: {
    description: "print working directory",
    run: () => <Line>{`/home/${config.identity.handle}`}</Line>,
  },

  date: {
    description: "print the current date and time",
    run: () => <Line>{new Date().toString()}</Line>,
  },

  echo: {
    description: "echo text back",
    run: (args) => <Line>{args.join(" ")}</Line>,
  },

  history: {
    description: "show command history",
    run: (_args, ctx) => (
      <div>
        {ctx.pastCommands.map((c, i) => (
          <Line key={i} dim>
            {`  ${i + 1}  ${c}`}
          </Line>
        ))}
      </div>
    ),
  },

  man: {
    description: "show the manual page for a command",
    run: (args) => {
      const query = args[0]?.toLowerCase();
      if (!query) return <Line dim>usage: man &lt;command&gt;</Line>;

      const name = Object.hasOwn(aliases, query) ? aliases[query] : query;
      const cmd = Object.hasOwn(commands, name) ? commands[name] : undefined;
      if (!cmd) return <Line>No manual entry for {query}</Line>;

      return (
        <div>
          <Heading>{name.toUpperCase()}(1)</Heading>
          <Line>{"  " + cmd.description}</Line>
        </div>
      );
    },
  },

  neofetch: {
    description: "show a system info banner",
    run: () => {
      const title = `${config.identity.handle}@${config.identity.host}`;
      return (
        <div>
          <Line>
            <span className="text-term-accent">{title}</span>
          </Line>
          <Line dim>{"-".repeat(title.length)}</Line>
          <Line>
            <span className="text-term-accent">OS</span>: PWW Terminal
          </Line>
          <Line>
            <span className="text-term-accent">Role</span>: {config.identity.role}
          </Line>
          <Line>
            <span className="text-term-accent">Location</span>:{" "}
            {config.identity.location}
          </Line>
          <Line>
            <span className="text-term-accent">Shell</span>: /bin/pww-sh
          </Line>
        </div>
      );
    },
  },

  sudo: {
    description: "attempt to gain root",
    run: () => (
      <div>
        <Line>Permission denied.</Line>
        <Line dim>(this incident will be reported)</Line>
      </div>
    ),
  },

  exit: {
    description: "leave the terminal",
    run: () => <Line dim>there is no escape. try closing the tab.</Line>,
  },

  crt: {
    description: "toggle CRT effects (scanlines/glow/flicker)",
    run: (_args, ctx) => {
      ctx.toggleCrt();
      return <Line dim>crt effects {ctx.crtOn ? "disabled" : "enabled"}</Line>;
    },
  },

  clear: {
    description: "clear the screen",
    run: (_args, ctx) => {
      ctx.clear();
      return null;
    },
  },
};

// aliases map to a canonical command name
const aliases: Record<string, string> = {
  experience: "experiences",
  work: "experiences",
  cv: "resume",
  project: "projects",
  home: "about",
};

export function runCommand(
  input: string,
  ctx: CommandContext,
): ReactNode {
  const [rawName, ...args] = input.trim().split(/\s+/);
  if (!rawName) return null;

  const query = rawName.toLowerCase();
  const name = Object.hasOwn(aliases, query) ? aliases[query] : query;
  const cmd = Object.hasOwn(commands, name) ? commands[name] : undefined;

  if (!cmd) {
    return (
      <div>
        command not found: {rawName}
        <div className="text-term-dim">type &apos;help&apos; for a list of commands</div>
      </div>
    );
  }

  return cmd.run(args, ctx);
}
