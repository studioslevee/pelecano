<script setup lang="ts">
import type { PageContent, ProjectEntry, SiteSettings, TeamEntry } from "~/types/content";

const { data: page } = await useFetch<PageContent>("/api/pages/careers");
const { data: projects } = await useFetch<ProjectEntry[]>("/api/projects");
const { data: team } = await useFetch<TeamEntry[]>("/api/team");
const { data: settings } = await useFetch<SiteSettings>("/api/settings");
</script>

<template>
  <div v-if="page" class="page-shell">
    <HeroSection
      :eyebrow="page.hero.eyebrow"
      :headline="page.hero.headline"
      :subhead="page.hero.subhead"
      :image="page.hero.image"
      :video="page.hero.video"
      :media-type="page.hero.media_type"
      compact
      full-bleed
    />

    <PageSections :page="page" :projects="projects" :team="team" :settings="settings" />
  </div>
</template>
