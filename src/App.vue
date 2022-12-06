<script setup>
import { useRouter, useRoute } from "vue-router";
import { useSessionStore } from "@/stores/session";

provide("router", useRouter());
provide("route", useRoute());
provide("session", useSessionStore());
</script>

<template>
  <header>
    <Navbar />
  </header>

  <RouterView class="container" />
</template>

<style scoped></style>
