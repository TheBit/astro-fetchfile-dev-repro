# Custom `src/fetch.ts` + `@astrojs/cloudflare` `prerenderEnvironment: "node"` breaks `astro dev`

Minimal reproduction for an Astro dev-server bug.

## Steps

```sh
npm install
npm run dev
curl -s http://localhost:4321/ | head -c 400
```

## Actual

`GET /` returns `200` with a truncated document (~391 bytes): the page stops before the
`<Counter client:load />` island, and the dev server logs:

```
Unable to resolve [/…/src/pages/index.astro?astro&type=script&index=0&lang.ts]
  Stack trace:
    at … (node_modules/astro/dist/core/environment/production.js:54:10)
    at renderScript (node_modules/astro/dist/runtime/server/render/script.js:15:33)
    …
    at handlePages (node_modules/astro/dist/core/pages/handler.js:39:22)
```

## Expected

The page renders as it does with Astro's default fetch handler: the full document with the
hydrated island and the hoisted script.

## Controls

| Variant | Result in `astro dev` |
|---|---|
| `src/fetch.ts` + `prerenderEnvironment: "node"` (this repo) | 200, 391 B, 0 islands, `Unable to resolve` |
| `src/fetch.ts` removed, `prerenderEnvironment: "node"` | 200, ~6.7 KB, 1 island, no errors |
| `src/fetch.ts` + `prerenderEnvironment: "workerd"` | 200, ~6.4 KB, 1 island, no errors |

`astro build` succeeds in every variant; only the dev server is affected.

`src/fetch.ts` here is the smallest possible handler — `astro(new FetchState(request))` — so the
custom handler itself does nothing beyond the default pipeline.
