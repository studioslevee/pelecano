<script setup lang="ts">
onMounted(() => {
  if (import.meta.client) {
    window.localStorage.setItem("pellicano-contact-submitted", "true");
  }
});
</script>

<template>
  <div class="page-shell">
    <section class="section form-success">
      <h1>Message received.</h1>
      <p>Thank you for reaching out. Someone from the Pellicano team will follow up soon.</p>
      <NuxtLink to="/contact" class="button-link">Back to Contact</NuxtLink>
    </section>
  </div>
</template>
