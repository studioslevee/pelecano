import { readdirSync } from "node:fs";
import { resolve } from "node:path";

const projectRoutes = readdirSync(resolve("content/projects"), { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith(".yml"))
  .map((entry) => `/projects/${entry.name.replace(/\.yml$/, "")}`);

export default defineNuxtConfig({
  compatibilityDate: "2025-03-01",
  devtools: { enabled: true },
  app: {
    head: {
      title: "Pellicano Construction",
      meta: [
        {
          name: "description",
          content:
            "Pellicano Construction is a regional construction management partner serving commercial, faith-based, hospitality, industrial, and healthcare clients."
        }
      ]
    }
  },
  css: ["~/assets/css/main.css"],
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ["/", "/our-story", "/projects", ...projectRoutes]
    }
  }
});
