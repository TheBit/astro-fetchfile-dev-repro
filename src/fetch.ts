// The smallest custom fetch handler: it does exactly what Astro's default one does.
import type { Fetchable } from "astro";
import { astro, FetchState } from "astro/fetch";

export default {
  fetch(request: Request) {
    return astro(new FetchState(request));
  },
} satisfies Fetchable;
