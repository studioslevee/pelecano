<script setup lang="ts">
onMounted(() => {
  if (import.meta.client) {
    window.localStorage.setItem("pellicano-careers-submitted", "true");
  }
});
</script>

<template>
  <div class="page-shell">
    <section class="section form-success">
      <h1>Application received.</h1>
      <p>Thank you for your interest in Pellicano Construction. The team will review your submission.</p>
      <NuxtLink to="/careers" class="button-link">Back to Careers</NuxtLink>
    </section>
  </div>
</template>
