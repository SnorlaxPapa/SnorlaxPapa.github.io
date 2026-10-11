# Rongyang Ye — Terminal Portfolio

Personal portfolio based on [PWW Terminal Portfolio Template](https://github.com/bse-at-ucla/pww-terminal-template).
Includes experience, projects, a portrait, résumé download, and DeepSeek-V3 distributed training marked in progress.

## Publish on GitHub Pages

The included `.github/workflows/deploy-pages.yml` builds and deploys the static export whenever `main` changes.

1. Push this project to your GitHub repository. A repository named `<username>.github.io` publishes at `https://<username>.github.io/`.
2. In the repository's **Settings → Pages**, choose **GitHub Actions** as the source.
3. Run **Deploy portfolio to GitHub Pages** from **Actions**, or push a commit to `main`.

The workflow detects the Pages base path, so project repositories work too. The production files are generated in `out/`.
Requires Node.js 22 and pnpm 10.28.2; the workflow installs both.

## Template

A retro, green-phosphor CRT terminal portfolio template. Visitors navigate by
typing commands (`about`, `experiences`, `projects`, `contact`, ...) instead
of scrolling a normal page.

## How to use this template

Everything you need to edit lives in **one file: [`config.ts`](./config.ts)**.
Fill in your name, role, about text, experience, projects, and contact info,
and the whole site (boot sequence, prompt, and every command's output)
updates automatically. No other files need to change to make this yours.

Want a different phosphor color? Change `theme.accent` in `config.ts` (try
`#ffb000` for amber or `#33aaff` for a blue terminal look).

### Commands

`help`, `about`, `resume`, `experiences`, `projects` (or `projects <n>` for one
project), `contact`, `whoami`, `ls`, `crt` (toggle CRT effects), `clear`.
Command logic lives in [`app/lib/commands.tsx`](./app/lib/commands.tsx) if
you want to add your own.

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see it.

## Deploying as a static site (e.g. GitHub Pages)

Static export is already enabled in `next.config.ts`:

```ts
output: "export",
```

Then `pnpm build` will produce a static `out/` folder you can host anywhere.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
