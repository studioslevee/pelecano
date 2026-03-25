import { promises as fs } from "node:fs";
import { resolve, basename } from "node:path";
import { parse } from "yaml";
import type {
  PageContent,
  ProjectEntry,
  SiteSettings,
  TeamEntry
} from "~/types/content";

const contentRoot = resolve(process.cwd(), "content");
const mediaRoot = resolve(process.cwd(), "public/media/uploads");
const teamMediaRoot = "/media/uploads";

async function readYamlFile<T>(relativePath: string): Promise<T> {
  const raw = await fs.readFile(resolve(contentRoot, relativePath), "utf8");
  return parse(raw) as T;
}

async function readCollection<T>(relativeDir: string): Promise<T[]> {
  const dir = resolve(contentRoot, relativeDir);
  const entries = await fs.readdir(dir);
  const files = entries.filter((entry) => entry.endsWith(".yml")).sort();
  return Promise.all(files.map((file) => readYamlFile<T>(`${relativeDir}/${file}`)));
}

function normalizePage(page: PageContent): PageContent {
  return {
    ...page,
    hero: {
      media_type: page.hero?.media_type ?? "image",
      image: page.hero?.image,
      video: page.hero?.video,
      eyebrow: page.hero?.eyebrow,
      headline: page.hero?.headline ?? page.title,
      subhead: page.hero?.subhead,
      hide_copy: page.hero?.hide_copy ?? false
    },
    sections: Array.isArray(page.sections) ? page.sections : []
  };
}

async function listMediaFiles(dir: string): Promise<string[]> {
  try {
    const files = await fs.readdir(dir);
    return files
      .filter((file) => !file.startsWith("._") && file !== ".DS_Store")
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
      .map((file) => file);
  } catch {
    return [];
  }
}

function chooseThumbnail(files: string[]): string | undefined {
  const square = files.find((file) => /sq|300x300/i.test(file));
  return square ?? files[0];
}

function chooseHero(files: string[], thumbnail?: string): string | undefined {
  const candidates = files.filter((file) => file !== thumbnail);
  return candidates[0] ?? thumbnail;
}

export async function getSettings() {
  return readYamlFile<SiteSettings>("settings/site.yml");
}

export async function getPageBySlug(slug: string) {
  try {
    const page = await readYamlFile<PageContent>(`pages/${slug}.yml`);
    return normalizePage(page);
  } catch {
    return null;
  }
}

export async function getPages() {
  const pages = await readCollection<PageContent>("pages");
  return pages.map(normalizePage);
}

export async function getProjects() {
  const projects = await readCollection<ProjectEntry>("projects");
  const hydrated = await Promise.all(
    projects.map(async (project) => {
      const allFiles = await listMediaFiles(mediaRoot);
      const files = allFiles.filter((file) => file.startsWith(`${project.slug}__`));
      const thumbnailFile = chooseThumbnail(files);
      const heroFile = chooseHero(files, basename(project.thumbnail ?? thumbnailFile ?? ""));
      const thumbnail = project.thumbnail ?? (thumbnailFile ? `/media/uploads/${thumbnailFile}` : undefined);
      const hero = project.hero_image ?? (heroFile ? `/media/uploads/${heroFile}` : undefined);
      const gallery =
        project.gallery?.length
          ? project.gallery
          : files
              .filter((file) => file !== basename(thumbnail ?? "") && file !== basename(hero ?? ""))
              .map((file) => `/media/uploads/${file}`);

      return {
        ...project,
        thumbnail,
        hero_image: hero,
        gallery
      } as ProjectEntry;
    })
  );

  return hydrated.sort((a, b) => a.title.localeCompare(b.title));
}

export async function getProjectBySlug(slug: string) {
  const projects = await getProjects();
  return projects.find((project) => project.slug === slug) ?? null;
}

export async function getTeam() {
  const team = await readCollection<TeamEntry>("team");
  return team
    .map((member) => ({
      ...member,
      headshot: member.headshot ?? `${teamMediaRoot}/team__${member.source_filename}`
    }))
    .sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
}
