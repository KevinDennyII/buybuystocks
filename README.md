# Buy Buy Stocks

A personal trading desk on the web: day trades, long-term conviction plays, a JSON-powered watchlist, and a trade journal — styled like a friendly fintech landing page, without taking itself too seriously.

## Stack

- **React 19** + **Vite 6**
- **React Router** (`/` home, `/journal`)
- **CSS modules** + global tokens (fluid type, whimsy-adjacent cards, dark theme)
- **JSON** for copy and data until a real backend shows up

## Scripts

```bash
npm install    # first time
npm run dev    # http://localhost:5173
npm run build  # output → dist/
npm run preview
npm run lint
```

## Deploy (Netlify)

`netlify.toml` is ready: build command `npm run build`, publish `dist/`. Connect the repo and ship.

---

## Author note

**The initial application code in this repository was written by a Cursor AI coding assistant (not by the repo owner).** You’re welcome to fork, remix, and own it from here — bugs, opinions, and future commits are yours.

MIT license — see `LICENSE`.
