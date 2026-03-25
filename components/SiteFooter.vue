<script setup lang="ts">
import type { SiteSettings } from "~/types/content";

defineProps<{
  settings: SiteSettings;
}>();
</script>

<template>
  <footer class="site-footer">
    <div class="footer-bar">
      <div>
        <NuxtLink to="/" class="footer-brand">
          <img v-if="settings.brand_logo" :src="settings.brand_logo" :alt="settings.site_title" class="footer-brand__logo" />
          <span v-else>Pellicano</span>
        </NuxtLink>
        <p class="footer-statement">{{ settings.footer_statement }}</p>
        <p class="footer-copy footer-copy--muted">{{ settings.copyright }}</p>
      </div>
      <div class="footer-section">
        <p class="footer-label">Navigation</p>
        <div class="footer-inline">
          <NuxtLink v-for="item in settings.footer_menu" :key="item.href" :to="item.href" class="footer-link">
            {{ item.label }}
          </NuxtLink>
        </div>
      </div>
      <div class="footer-section">
        <p class="footer-label">Contact</p>
        <div class="footer-inline">
          <span class="footer-copy">{{ settings.address_lines.join(", ") }}</span>
          <a class="footer-link" :href="`tel:${settings.phone}`">{{ settings.phone }}</a>
          <a class="footer-link" :href="`mailto:${settings.email}`">{{ settings.email }}</a>
        </div>
      </div>
      <div class="footer-section">
        <p class="footer-label">Connect</p>
        <div class="footer-inline">
          <a v-for="link in settings.social_links" :key="link.label" :href="link.href" class="footer-link" target="_blank" rel="noreferrer">
            {{ link.label }}
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>
