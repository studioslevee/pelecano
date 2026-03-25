<script setup lang="ts">
import type { SiteSettings } from "~/types/content";

const { data: settings } = await useFetch<SiteSettings>("/api/settings", {
  key: "site-settings"
});

const route = useRoute();
const isHome = computed(() => route.path === "/");
</script>

<template>
  <div class="site-shell">
    <SiteHeader v-if="settings" :settings="settings" :home="isHome" />
    <main>
      <slot />
    </main>
    <SiteFooter v-if="settings" :settings="settings" />
  </div>
</template>
