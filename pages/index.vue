<script setup lang="ts">
import type { PageContent, ProjectEntry, SiteSettings, TeamEntry } from "~/types/content";

const { data: page } = await useFetch<PageContent>("/api/pages/home");
const { data: projects } = await useFetch<ProjectEntry[]>("/api/projects");
const { data: team } = await useFetch<TeamEntry[]>("/api/team");
const { data: settings } = await useFetch<SiteSettings>("/api/settings");
</script>

<template>
  <div v-if="page" class="page-shell">
    <HeroSection
      :video="page.hero.video"
      :image="page.hero.image"
      :media-type="page.hero.media_type"
      :eyebrow="page.hero.eyebrow"
      :headline="page.hero.headline"
      :subhead="page.hero.subhead"
      full-bleed
      :hide-copy="page.hero.hide_copy"
    />

    <PageSections :page="page" :projects="projects" :team="team" :settings="settings" />
  </div>
</template>
