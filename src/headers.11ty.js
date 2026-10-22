// Cloudflare-Pages-Datei "_headers", nur im Vorschau-Build: sperrt alle Dateien (auch PDFs) für Suchmaschinen.
// Im normalen Build für www.mia-ddg.de entsteht diese Datei nicht.
export const data = {
  layout: false,
  eleventyExcludeFromCollections: true,
  eleventyComputed: {
    permalink: (data) => (data.preview ? "/_headers" : false),
  },
};

export function render() {
  return "/*\n  X-Robots-Tag: noindex, nofollow\n";
}
