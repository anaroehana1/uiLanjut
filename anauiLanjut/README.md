# anauiLanjut

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

## Event API

The event catalog and organizer dashboard use a REST API. Set its base URL in a
local `.env` file before starting Vite:

```env
VITE_API_URL=http://localhost:3000
```

The server must provide `GET /events`, `GET /events/:id`, `POST /events`,
`PATCH /events/:id` (to mark an event complete), and `DELETE /events/:id`.
Event records include an `id` and may include `title`, `date`, `loc`, `cat`,
`quota`, `price`, `desc`, and `done`. The app shows loading, error, and empty
states when fetching the catalog.
