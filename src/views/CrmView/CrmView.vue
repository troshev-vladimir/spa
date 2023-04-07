<template>
  <div class="container">
    <div class="row wrap buttons">
      <q-btn label="клиенты" @click="router.push({ name: 'users' })" />
      <q-btn label="События" @click="router.push({ name: 'users' })" />
      <q-btn label="Продажи" @click="router.push({ name: 'users' })" />
      <q-btn label="Постпления" @click="router.push({ name: 'users' })" />
      <q-btn label="Отчёты" @click="router.push({ name: 'reports' })" />
    </div>
    <div class="q-pa-md"><router-view /></div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
</script>

<style scoped lang="scss">
.buttons {
  column-gap: 20px;
  margin-bottom: 20px;
}
</style>
