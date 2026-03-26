<script setup lang="ts">
import type { PageContent, SiteSettings } from "~/types/content";

const props = defineProps<{
  settings: SiteSettings;
  home?: boolean;
}>();

const route = useRoute();

const isHome = computed(() => props.home ?? route.path === "/");
const { data: homePage } = await useFetch<PageContent>("/api/pages/home", {
  key: "home-header-copy"
});

const contactItem = computed(() => props.settings.nav_items.find((item) => item.label.toLowerCase() === "contact"));
const primaryNavItems = computed(() =>
  isHome.value
    ? props.settings.nav_items.filter((item) => item.label.toLowerCase() !== "contact")
    : props.settings.nav_items
);
const homeNavItems = computed(() =>
  isHome.value && contactItem.value ? [...primaryNavItems.value, contactItem.value] : primaryNavItems.value
);
</script>

<template>
  <header class="site-header" :class="{ 'site-header--home': isHome, 'site-header--solid': !isHome }">
    <div class="site-header__left">
      <NuxtLink to="/" class="brand">
        <img v-if="settings.brand_logo" :src="settings.brand_logo" :alt="settings.site_title" class="brand-logo" />
        <div v-else class="brand-copy">
          <span class="brand-mark">Pellicano</span>
          <span class="brand-subtitle">Construction</span>
        </div>
      </NuxtLink>
      <nav class="site-nav">
        <NuxtLink
          v-for="item in isHome ? homeNavItems : primaryNavItems"
          :key="item.href"
          :to="item.href"
          class="site-nav__link"
          :class="{
            'site-nav__link--active': route.path === item.href,
            'site-nav__link--contact-mobile': isHome && item.label.toLowerCase() === 'contact'
          }"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>
    </div>
    <NuxtLink v-if="isHome && contactItem" :to="contactItem.href" class="site-header__action desktop-only">
      {{ contactItem.label }}
    </NuxtLink>
    <div v-if="isHome && homePage" class="site-header__home-copy">
      <p>{{ homePage.hero.eyebrow }}</p>
      <strong>{{ homePage.hero.headline }}</strong>
    </div>
  </header>
</template>
