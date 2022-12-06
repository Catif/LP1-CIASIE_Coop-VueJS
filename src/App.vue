<script setup>
import { useRouter, useRoute } from "vue-router";
import { useSessionStore } from "@/stores/session";
import mitt from "mitt";

provide("router", useRouter());
provide("route", useRoute());
provide("session", useSessionStore());
provide("bus", mitt());
</script>

<template>
  <header>
    <Navbar />
  </header>

  <RouterView class="container" />
</template>

<style scoped></style>
