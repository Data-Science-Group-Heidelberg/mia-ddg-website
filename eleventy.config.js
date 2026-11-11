import yaml from "js-yaml";

export default function (eleventyConfig) {
  // img/MiA_DDG_logo (Logo-Kit) und img/persons (Originalfotos) bleiben Quelle und werden nicht veröffentlicht;
  // img/team enthält die verkleinerten Fotos fürs Web
  for (const path of ["style.css", "favicon.svg", "favicon.ico", "apple-touch-icon.png", "fonts", "unterlagen", "img/logos", "img/brand", "img/team", "aktuelles/img"]) {
    eleventyConfig.addPassthroughCopy(`src/${path}`);
  }

  eleventyConfig.addDataExtension("yaml", (contents) => yaml.load(contents));

  // Vorschau-Build (npm run build:preview): für Suchmaschinen gesperrt, siehe base.njk und src/headers.11ty.js
  eleventyConfig.addGlobalData("preview", Boolean(process.env.PREVIEW));

  // Entwürfe (draft: true im Front Matter) werden nie gebaut; nur "npm run start:drafts" zeigt sie lokal an
  eleventyConfig.addPreprocessor("drafts", "*", (data) => {
    if (data.draft && !process.env.SHOW_DRAFTS) return false;
  });

  // "15. Oktober 2026"
  const dateDE = new Intl.DateTimeFormat("de-DE", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  eleventyConfig.addFilter("dateDE", (date) => dateDE.format(date));
  eleventyConfig.addFilter("isoDate", (date) => date.toISOString().slice(0, 10));

  eleventyConfig.addFilter("head", (arr, n) => arr.slice(0, n));

  // Newest first
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/aktuelles/*.md").sort((a, b) => b.date - a.date)
  );

  // Publications grouped by year, newest first: [{ year, items: [...] }]
  eleventyConfig.addFilter("byYear", (pubs = []) => {
    const groups = new Map();
    for (const p of pubs) {
      if (!groups.has(p.year)) groups.set(p.year, []);
      groups.get(p.year).push(p);
    }
    return [...groups].sort((a, b) => b[0] - a[0]).map(([year, items]) => ({ year, items }));
  });

  return {
    dir: { input: "src", output: "_site" },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
}
