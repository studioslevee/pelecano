<script setup lang="ts">
import type { ComponentPublicInstance } from "vue";
import type {
  PageContent,
  PageSection,
  ProjectEntry,
  SiteSettings,
  TeamEntry
} from "~/types/content";

const props = defineProps<{
  page: PageContent;
  projects?: ProjectEntry[];
  team?: TeamEntry[];
  settings?: SiteSettings;
}>();

const activeMember = ref<TeamEntry | null>(null);
const activeFilters = reactive<Record<string, string>>({});
const timelineRoots = ref<HTMLElement[]>([]);
const route = useRoute();
const contactSubmitted = ref(false);
const careersSubmitted = ref(false);
const submittingStates = reactive({
  contact: false,
  careers: false
});
let revealObserver: IntersectionObserver | null = null;
const CONTACT_STORAGE_KEY = "pellicano-contact-submitted";
const CAREERS_STORAGE_KEY = "pellicano-careers-submitted";

const visibleSections = computed(() => (props.page.sections ?? []).filter((section) => section.enabled !== false));
const isContactPage = computed(() => props.page.slug === "contact" || route.path === "/contact");

function sectionKey(section: PageSection, index: number) {
  return section.section_id || `${section.type}-${index}`;
}

function filteredProjects(section: Extract<PageSection, { type: "project_grid" }>, index: number) {
  const allProjects = props.projects ?? [];
  const key = sectionKey(section, index);
  const active = activeFilters[key] ?? section.filter_labels[0] ?? "All";

  if (active === "All") {
    return allProjects;
  }

  return allProjects.filter((project) => project.category === active);
}

function featuredProjects(section: Extract<PageSection, { type: "featured_projects" }>) {
  return (section.project_slugs ?? [])
    .map((slug) => props.projects?.find((project) => project.slug === slug))
    .filter(Boolean) as ProjectEntry[];
}

function setTimelineRoot(el: Element | ComponentPublicInstance | null) {
  if (el instanceof HTMLElement && !timelineRoots.value.includes(el)) {
    timelineRoots.value.push(el);
  }
}

function initRevealObserver() {
  const items = timelineRoots.value.flatMap((root) => Array.from(root.querySelectorAll<HTMLElement>(".reveal-on-scroll")));
  if (!items.length) {
    return;
  }

  revealObserver?.disconnect();
  revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        entry.target.classList.toggle("is-visible", entry.isIntersecting);
      }
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px"
    }
  );

  items.forEach((item) => revealObserver?.observe(item));
}

function normalizePhoneInput(event: Event) {
  const input = event.target as HTMLInputElement | null;
  if (!input) {
    return;
  }

  const digits = input.value.replace(/\D/g, "").slice(0, 10);
  if (digits.length <= 3) {
    input.value = digits;
    return;
  }

  if (digits.length <= 6) {
    input.value = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return;
  }

  input.value = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function handleFormSubmit(type: "contact" | "careers", event: Event) {
  const alreadySubmitted = type === "contact" ? contactSubmitted.value : careersSubmitted.value;
  if (alreadySubmitted || submittingStates[type]) {
    event.preventDefault();
    return;
  }

  submittingStates[type] = true;
}

onMounted(() => {
  if (import.meta.client) {
    contactSubmitted.value = window.localStorage.getItem(CONTACT_STORAGE_KEY) === "true";
    careersSubmitted.value = window.localStorage.getItem(CAREERS_STORAGE_KEY) === "true";
  }
  initRevealObserver();
});

watch(
  () => props.page.sections,
  async () => {
    timelineRoots.value = [];
    await nextTick();
    initRevealObserver();
  },
  { deep: true }
);

onBeforeUnmount(() => {
  revealObserver?.disconnect();
});
</script>

<template>
  <div>
    <template v-for="(section, index) in visibleSections" :key="sectionKey(section, index)">
      <section v-if="section.type === 'intro'" class="section two-column">
        <div>
          <p v-if="section.eyebrow" class="eyebrow">{{ section.eyebrow }}</p>
          <h2>{{ section.headline }}</h2>
        </div>
        <p class="section-copy">{{ section.body }}</p>
      </section>

      <section v-else-if="section.type === 'timeline'" class="section">
        <div class="section-heading">
          <h2>{{ section.headline }}</h2>
        </div>
        <div :ref="setTimelineRoot" class="timeline">
          <div class="timeline-start reveal-on-scroll">
            <img
              v-if="settings?.brand_logo"
              :src="settings.brand_logo"
              :alt="settings.site_title"
              class="timeline-start__logo timeline-start__logo--full"
            />
            <span class="timeline-start__line" />
          </div>
          <article
            v-for="(item, itemIndex) in section.items"
            :key="`${item.year}-${item.label}`"
            class="timeline-entry reveal-on-scroll"
            :style="{ '--timeline-delay': `${itemIndex * 100}ms` }"
          >
            <div class="timeline-entry__mark" />
            <div class="timeline-entry__copy">
              <p class="timeline-year">{{ item.year }}</p>
              <h3>{{ item.label }}</h3>
            </div>
          </article>
        </div>
      </section>

      <section v-else-if="section.type === 'featured_projects'" class="section featured-layout">
        <div class="featured-copy">
          <p v-if="section.eyebrow" class="eyebrow">{{ section.eyebrow }}</p>
          <h2>{{ section.headline }}</h2>
          <p>{{ section.body }}</p>
        </div>
        <div class="featured-stack">
          <div
            v-for="(project, projectIndex) in featuredProjects(section)"
            :key="project.slug"
            class="featured-stack__item"
            :style="{ '--card-index': projectIndex }"
          >
            <ProjectCard :project="project" featured :index="projectIndex" />
          </div>
        </div>
      </section>

      <section v-else-if="section.type === 'callout'" class="section section--callout">
        <p v-if="section.eyebrow" class="eyebrow">{{ section.eyebrow }}</p>
        <h2>{{ section.headline }}</h2>
        <p>{{ section.body }}</p>
      </section>

      <section v-else-if="section.type === 'logo_grid'" class="section logos-section">
        <div class="section-heading">
          <h2>{{ section.headline }}</h2>
        </div>
        <div class="logos-grid">
          <img v-for="logo in section.logos" :key="logo.image" :src="logo.image" :alt="logo.alt" class="logos-grid__logo" />
        </div>
      </section>

      <section v-else-if="section.type === 'numbered_media'" class="section sticky-section">
        <div class="sticky-section__content">
          <p v-if="section.eyebrow" class="eyebrow">{{ section.eyebrow }}</p>
          <h2>{{ section.headline }}</h2>
          <article v-for="item in section.items" :key="item.number" class="numbered-item">
            <span>{{ item.number }}</span>
            <div>
              <h3>{{ item.title }}</h3>
              <p>{{ item.body }}</p>
            </div>
          </article>
        </div>
        <div class="sticky-section__media">
          <img :src="section.image" alt="Section image" />
        </div>
      </section>

      <section
        v-else-if="section.type === 'contact_cta'"
        :id="section.anchor_id"
        class="section contact-banner"
      >
        <div>
          <p v-if="section.eyebrow" class="eyebrow">{{ section.eyebrow }}</p>
          <h2>{{ section.headline }}</h2>
          <p>{{ section.body }}</p>
        </div>
        <NuxtLink class="button-link" :to="section.link_href">
          {{ section.link_label }}
        </NuxtLink>
      </section>

      <section v-else-if="section.type === 'story_blocks'" class="section story-grid">
        <article
          v-for="block in section.blocks"
          :key="block.headline"
          class="story-block"
          :class="{ 'story-block--reverse': block.image_alignment === 'left' }"
        >
          <img :src="block.image" :alt="block.headline" />
          <div>
            <h2>{{ block.headline }}</h2>
            <p>{{ block.body }}</p>
          </div>
        </article>
      </section>

      <section v-else-if="section.type === 'team_grid'" class="section">
        <div class="section-heading">
          <p v-if="section.eyebrow" class="eyebrow">{{ section.eyebrow }}</p>
          <h2>{{ section.headline }}</h2>
          <p>{{ section.body }}</p>
        </div>
        <div class="team-grid">
          <button
            v-for="member in team"
            :key="member.slug"
            type="button"
            class="team-card"
            @click="activeMember = member"
          >
            <img :src="member.headshot" :alt="member.name" />
            <h3>{{ member.name }}</h3>
            <p>{{ member.title }}</p>
          </button>
        </div>
      </section>

      <section v-else-if="section.type === 'project_grid'" class="section">
        <div class="filter-bar">
          <button
            v-for="label in section.filter_labels"
            :key="label"
            type="button"
            :class="{ active: (activeFilters[sectionKey(section, index)] ?? section.filter_labels[0] ?? 'All') === label }"
            @click="activeFilters[sectionKey(section, index)] = label"
          >
            {{ label }}
          </button>
        </div>
        <div class="projects-grid">
          <ProjectCard v-for="project in filteredProjects(section, index)" :key="project.slug" :project="project" />
        </div>
      </section>

      <section v-else-if="section.type === 'contact_info'" class="section two-column">
        <div>
          <h2>{{ section.headline }}</h2>
          <p class="section-copy">{{ section.body }}</p>
        </div>
        <div v-if="settings" class="contact-details">
          <p v-for="line in settings.address_lines" :key="line">{{ line }}</p>
          <a :href="`tel:${settings.phone}`">{{ settings.phone }}</a>
          <a :href="`mailto:${settings.email}`">{{ settings.email }}</a>
        </div>
      </section>

      <section v-else-if="section.type === 'contact_form'" class="section form-section" :class="{ 'form-section--contact': isContactPage }">
        <div>
          <h2>{{ section.headline }}</h2>
          <p class="section-copy">{{ section.body }}</p>
          <div v-if="isContactPage && settings" class="contact-details contact-details--panel">
            <p v-for="line in settings.address_lines" :key="line">{{ line }}</p>
            <a :href="`tel:${settings.phone}`">{{ settings.phone }}</a>
            <a :href="`mailto:${settings.email}`">{{ settings.email }}</a>
          </div>
        </div>
        <div v-if="contactSubmitted" class="form-thankyou">
          <h3>Thank you.</h3>
          <p>Your message has already been received. Someone from the Pellicano team will follow up soon.</p>
        </div>
        <form
          v-else
          name="contact"
          method="POST"
          action="/contact/success"
          data-netlify="true"
          netlify-honeypot="bot-field"
          class="site-form"
          @submit="handleFormSubmit('contact', $event)"
        >
          <input type="hidden" name="form-name" value="contact" />
          <input type="hidden" name="bot-field" />
          <label class="form-field">
            <span>Name</span>
            <input type="text" name="name" maxlength="80" autocomplete="name" required />
          </label>
          <label class="form-field">
            <span>Email</span>
            <input type="email" name="email" maxlength="120" autocomplete="email" inputmode="email" required />
          </label>
          <label class="form-field">
            <span>Number</span>
            <input
              type="tel"
              name="number"
              maxlength="14"
              inputmode="tel"
              autocomplete="tel"
              pattern="^\(\d{3}\) \d{3}-\d{4}$"
              placeholder="(555) 555-5555"
              required
              @input="normalizePhoneInput"
            />
          </label>
          <label class="form-field form-field--full">
            <span>Question</span>
            <textarea name="question" rows="6" maxlength="1000" required />
          </label>
          <button type="submit" class="button-link" :disabled="submittingStates.contact">
            {{ submittingStates.contact ? "Sending..." : section.submit_label }}
          </button>
        </form>
      </section>

      <section v-else-if="section.type === 'careers_intro'" class="section careers-intro">
        <div class="section-heading">
          <h2>{{ section.intro_headline }}</h2>
        </div>
        <div class="careers-copy">
          <div class="careers-copy__block">
            <p>{{ section.intro_body }}</p>
          </div>
          <div class="careers-copy__block">
            <h3>{{ section.training_headline }}</h3>
            <p>{{ section.training_body }}</p>
          </div>
          <div class="careers-copy__block">
            <h3>{{ section.people_headline }}</h3>
            <p>{{ section.people_body }}</p>
          </div>
        </div>
      </section>

      <section v-else-if="section.type === 'careers_apply'" class="section form-section">
        <div>
          <p v-if="section.eyebrow" class="eyebrow">{{ section.eyebrow }}</p>
          <h2>{{ section.headline }}</h2>
          <p class="section-copy">{{ section.body }}</p>
          <a class="button-link" :href="section.linkedin_href" target="_blank" rel="noreferrer">
            {{ section.linkedin_label }}
          </a>
        </div>
        <div v-if="careersSubmitted" class="form-thankyou">
          <h3>Thank you.</h3>
          <p>Your application has already been received. The Pellicano team will review your submission.</p>
        </div>
        <form
          v-else
          name="careers"
          method="POST"
          action="/careers/success"
          enctype="multipart/form-data"
          data-netlify="true"
          netlify-honeypot="bot-field"
          class="site-form"
          @submit="handleFormSubmit('careers', $event)"
        >
          <input type="hidden" name="form-name" value="careers" />
          <input type="hidden" name="bot-field" />
          <label class="form-field">
            <span>Name</span>
            <input type="text" name="name" maxlength="80" autocomplete="name" required />
          </label>
          <label class="form-field">
            <span>Email</span>
            <input type="email" name="email" maxlength="120" autocomplete="email" inputmode="email" required />
          </label>
          <label class="form-field">
            <span>Number</span>
            <input
              type="tel"
              name="number"
              maxlength="14"
              inputmode="tel"
              autocomplete="tel"
              pattern="^\(\d{3}\) \d{3}-\d{4}$"
              placeholder="(555) 555-5555"
              required
              @input="normalizePhoneInput"
            />
          </label>
          <label class="form-field form-field--full">
            <span>Attach Resume</span>
            <input type="file" name="resume" accept=".pdf,.doc,.docx" required />
          </label>
          <button type="submit" class="button-link" :disabled="submittingStates.careers">
            {{ submittingStates.careers ? "Sending..." : section.submit_label }}
          </button>
        </form>
      </section>
    </template>

    <TeamModal :member="activeMember" @close="activeMember = null" />
  </div>
</template>
