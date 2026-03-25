<script setup lang="ts">
defineProps<{
  eyebrow?: string;
  headline: string;
  subhead?: string;
  sideLabel?: string;
  sideText?: string;
  image?: string;
  video?: string;
  mediaType?: "image" | "video";
  compact?: boolean;
  fullBleed?: boolean;
  hideCopy?: boolean;
}>();
</script>

<template>
  <section class="hero" :class="{ 'hero--compact': compact, 'hero--full': fullBleed, 'hero--split': sideText }">
    <div v-if="(mediaType === 'video' || video) && video" class="hero-media">
      <video :src="video" autoplay muted loop playsinline />
    </div>
    <div v-else-if="image" class="hero-media hero-media--image">
      <img :src="image" :alt="headline" />
    </div>
    <div v-if="!hideCopy" class="hero-copy">
      <div class="hero-copy__primary">
        <p v-if="eyebrow" class="eyebrow">{{ eyebrow }}</p>
        <h1>{{ headline }}</h1>
        <p v-if="subhead && !sideText" class="hero-subhead">{{ subhead }}</p>
      </div>
      <div v-if="sideText" class="hero-copy__secondary">
        <p v-if="sideLabel" class="hero-copy__side-label">{{ sideLabel }}</p>
        <p class="hero-subhead">{{ sideText }}</p>
      </div>
    </div>
  </section>
</template>
