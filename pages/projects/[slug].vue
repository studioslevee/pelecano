<script setup lang="ts">
import type { ProjectEntry } from "~/types/content";

const route = useRoute();
const { data: project } = await useFetch<ProjectEntry>(`/api/projects/${route.params.slug}`);

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: "Project not found" });
}

const activeIndex = ref(0);
const lightboxOpen = ref(false);
let carouselTimer: ReturnType<typeof setInterval> | undefined;

const galleryImages = computed(() => {
  if (!project.value) {
    return [];
  }

  const images = [project.value.hero_image, ...(project.value.gallery ?? [])].filter(Boolean) as string[];
  return [...new Set(images)];
});

const activeImage = computed(() => galleryImages.value[activeIndex.value] ?? "");

function selectImage(index: number) {
  activeIndex.value = index;
}

function stepCarousel(direction: number) {
  if (!galleryImages.value.length) {
    return;
  }

  activeIndex.value = (activeIndex.value + direction + galleryImages.value.length) % galleryImages.value.length;
}

function startCarousel() {
  if (!import.meta.client || galleryImages.value.length < 2) {
    return;
  }

  stopCarousel();
  carouselTimer = window.setInterval(() => stepCarousel(1), 4500);
}

function stopCarousel() {
  if (carouselTimer) {
    clearInterval(carouselTimer);
    carouselTimer = undefined;
  }
}

watch(galleryImages, () => {
  activeIndex.value = 0;
  startCarousel();
}, { immediate: true });

watch(lightboxOpen, (open) => {
  if (import.meta.client) {
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (open) {
    stopCarousel();
  } else {
    startCarousel();
  }
});

onBeforeUnmount(() => {
  stopCarousel();
  if (import.meta.client) {
    document.body.style.overflow = "";
  }
});
</script>

<template>
  <div v-if="project" class="page-shell">
    <HeroSection
      :image="project.hero_image"
      media-type="image"
      :eyebrow="project.category"
      :headline="project.title"
      :subhead="project.summary"
      compact
      full-bleed
    />

    <section class="section two-column">
      <div>
        <p class="eyebrow">Project Scope</p>
        <h2>{{ project.title }}</h2>
      </div>
      <p class="section-copy">{{ project.description || project.summary }}</p>
    </section>

    <section v-if="galleryImages.length" class="section">
      <div class="gallery-showcase">
        <div class="gallery-carousel">
          <button
            v-if="galleryImages.length > 1"
            type="button"
            class="gallery-control gallery-control--prev"
            @click="stepCarousel(-1)"
          >
            &larr;
          </button>
          <button type="button" class="gallery-stage" @click="lightboxOpen = true">
            <img :src="activeImage" :alt="project.title" />
          </button>
          <button
            v-if="galleryImages.length > 1"
            type="button"
            class="gallery-control gallery-control--next"
            @click="stepCarousel(1)"
          >
            &rarr;
          </button>
        </div>
        <div class="gallery-grid">
          <button
            v-for="(image, index) in galleryImages"
            :key="image"
            type="button"
            class="gallery-thumb"
            :class="{ 'gallery-thumb--active': index === activeIndex }"
            @click="
              selectImage(index);
              lightboxOpen = true;
            "
          >
            <img :src="image" :alt="`${project.title} image ${index + 1}`" />
            <span class="gallery-thumb__overlay">Expand</span>
          </button>
        </div>
      </div>
    </section>

    <Teleport to="body">
      <div v-if="lightboxOpen" class="modal-backdrop" @click.self="lightboxOpen = false">
        <div class="image-lightbox">
          <button type="button" class="modal-close" aria-label="Close image viewer" @click="lightboxOpen = false">
            &times;
          </button>
          <button
            v-if="galleryImages.length > 1"
            type="button"
            class="gallery-control gallery-control--prev"
            @click="stepCarousel(-1)"
          >
            &larr;
          </button>
          <img :src="activeImage" :alt="project.title" class="image-lightbox__image" />
          <button
            v-if="galleryImages.length > 1"
            type="button"
            class="gallery-control gallery-control--next"
            @click="stepCarousel(1)"
          >
            &rarr;
          </button>
        </div>
      </div>
    </Teleport>
  </div>
</template>
