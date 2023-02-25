<template>
  <q-header class="q-pa-md"
    ><q-btn
      class="q-px-xl q-py-xs bg-indigo-13 q-mr-md"
      push
      label="Выйти"
      @click="store.dispatch('user/exit')"
  /></q-header>
  <q-page-container>
    <q-page class="q-pa-lg">
      <router-view></router-view>
    </q-page>
  </q-page-container>
  <q-footer class="q-pa-md">q-footer</q-footer>
</template>

<script setup>
import { useStore } from "vuex";

const store = useStore();
</script>

<style></style>
