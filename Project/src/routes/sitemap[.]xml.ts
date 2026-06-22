import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const entries = [
          { path: "/", priority: "1.0" },
          { path: "/events", priority: "0.9" },
          { path: "/about", priority: "0.7" },
          { path: "/contact", priority: "0.7" },
          { path: "/login", priority: "0.5" },
          { path: "/register", priority: "0.5" },
        ];
        const urls = entries.map((e) =>
          `  <url>\n    <loc>${BASE_URL}${e.path}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
        );
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
