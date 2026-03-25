<script setup lang="ts">
import type { TeamEntry } from "~/types/content";

const props = defineProps<{
  member: TeamEntry | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const isOpen = computed(() => Boolean(props.member));

watch(isOpen, (open) => {
  if (import.meta.client) {
    document.body.style.overflow = open ? "hidden" : "";
  }
});

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.body.style.overflow = "";
  }
});
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen && member" class="modal-backdrop" @click.self="emit('close')">
      <div class="team-modal">
        <button type="button" class="modal-close" aria-label="Close modal" @click="emit('close')">
          &times;
        </button>
        <div class="team-modal__media">
          <img :src="member.headshot" :alt="member.name" class="team-modal__image" />
        </div>
        <div class="team-modal__content">
          <p class="eyebrow">Leadership</p>
          <h3>{{ member.name }}</h3>
          <p class="team-modal__title">{{ member.title }}</p>
          <div v-if="member.bio" class="team-modal__bio">{{ member.bio }}</div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
