import NotFound from "@/app/not-found";

/**
 * Rendered in place of `notFound()` when a catalogue slug does not exist.
 *
 * These routes stream (the static shell goes out before the page resolves), so
 * `notFound()` cannot set a 404 status. In production it also left the server
 * HTML with neither the not-found UI nor a noindex tag: the error surfaced only
 * in the RSC payload and the 404 page rendered client-side, a soft 404 for any
 * crawler that reads HTML. Rendering the page directly puts both into the HTML
 * (React hoists the <meta> into <head>). Pair it with buildNotFoundMetadata().
 */
export function MissingPage() {
  return (
    <>
      <meta name="robots" content="noindex, nofollow" />
      <NotFound />
    </>
  );
}
