<script setup lang="ts">
import type { ProjectEntry } from "~/types/content";

defineProps<{
  project: ProjectEntry;
  featured?: boolean;
  index?: number;
}>();
</script>

<template>
  <NuxtLink :to="`/projects/${project.slug}`" class="project-card" :class="{ 'project-card--featured': featured }">
    <div class="project-card__media">
      <img v-if="project.thumbnail" :src="project.thumbnail" :alt="project.title" class="project-card__image" />
      <div class="project-card__overlay">
        <span>View Project</span>
      </div>
    </div>
    <div class="project-card__body">
      <p class="eyebrow">{{ project.category }}</p>
      <h3>{{ project.title }}</h3>
      <p>{{ project.summary || "Explore project photography and scope details." }}</p>
    </div>
  </NuxtLink>
</template>
