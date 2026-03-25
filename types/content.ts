export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
}

export interface SiteSettings {
  site_title: string;
  brand_logo?: string;
  brand_mark?: string;
  nav_items: NavItem[];
  footer_menu: NavItem[];
  address_lines: string[];
  phone: string;
  email: string;
  social_links: SocialLink[];
  footer_statement: string;
  copyright: string;
}

export interface TimelineItem {
  year: string;
  label: string;
  description?: string;
}

export interface NumberedItem {
  number: string;
  title: string;
  body: string;
}

export interface StorySection {
  headline: string;
  body: string;
  image: string;
  image_alignment: "left" | "right";
}

export interface LogoItem {
  image: string;
  alt: string;
}

export interface PageHero {
  media_type: "video" | "image";
  image?: string;
  video?: string;
  eyebrow?: string;
  headline: string;
  subhead?: string;
  hide_copy?: boolean;
}

export interface PageSectionBase {
  type: string;
  enabled?: boolean;
  section_id?: string;
}

export interface IntroSection extends PageSectionBase {
  type: "intro";
  eyebrow?: string;
  headline: string;
  body: string;
}

export interface TimelineSection extends PageSectionBase {
  type: "timeline";
  headline: string;
  items: TimelineItem[];
}

export interface FeaturedProjectsSection extends PageSectionBase {
  type: "featured_projects";
  eyebrow?: string;
  headline: string;
  body: string;
  project_slugs: string[];
}

export interface CalloutSection extends PageSectionBase {
  type: "callout";
  eyebrow?: string;
  headline: string;
  body: string;
}

export interface LogoGridSection extends PageSectionBase {
  type: "logo_grid";
  headline: string;
  logos: LogoItem[];
}

export interface NumberedMediaSection extends PageSectionBase {
  type: "numbered_media";
  eyebrow?: string;
  headline: string;
  image: string;
  items: NumberedItem[];
}

export interface ContactCtaSection extends PageSectionBase {
  type: "contact_cta";
  anchor_id?: string;
  eyebrow?: string;
  headline: string;
  body: string;
  link_label: string;
  link_href: string;
}

export interface StoryBlocksSection extends PageSectionBase {
  type: "story_blocks";
  blocks: StorySection[];
}

export interface TeamGridSection extends PageSectionBase {
  type: "team_grid";
  eyebrow?: string;
  headline: string;
  body: string;
}

export interface ProjectGridSection extends PageSectionBase {
  type: "project_grid";
  filter_labels: string[];
}

export interface ContactInfoSection extends PageSectionBase {
  type: "contact_info";
  headline: string;
  body: string;
}

export interface ContactFormSection extends PageSectionBase {
  type: "contact_form";
  headline: string;
  body: string;
  submit_label: string;
}

export interface CareersIntroSection extends PageSectionBase {
  type: "careers_intro";
  intro_headline: string;
  intro_body: string;
  training_headline: string;
  training_body: string;
  people_headline: string;
  people_body: string;
}

export interface CareersApplySection extends PageSectionBase {
  type: "careers_apply";
  eyebrow?: string;
  headline: string;
  body: string;
  linkedin_label: string;
  linkedin_href: string;
  submit_label: string;
}

export type PageSection =
  | IntroSection
  | TimelineSection
  | FeaturedProjectsSection
  | CalloutSection
  | LogoGridSection
  | NumberedMediaSection
  | ContactCtaSection
  | StoryBlocksSection
  | TeamGridSection
  | ProjectGridSection
  | ContactInfoSection
  | ContactFormSection
  | CareersIntroSection
  | CareersApplySection;

export interface PageContent {
  title: string;
  slug: string;
  hero: PageHero;
  sections: PageSection[];
}

export interface ProjectEntry {
  title: string;
  slug: string;
  category: string;
  thumbnail?: string;
  hero_image?: string;
  summary?: string;
  description?: string;
  gallery?: string[];
  featured_on_home?: boolean;
  featured_order?: number;
  source_folder: string;
}

export interface TeamEntry {
  name: string;
  slug: string;
  title: string;
  headshot?: string;
  bio?: string;
  sort_order?: number;
  source_filename: string;
}
