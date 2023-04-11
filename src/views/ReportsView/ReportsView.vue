<template>
  <div class="row buttons">
    <q-btn
      color="primary"
      label="СВОДКА"
      @click="router.push({ name: 'report-summary' })"
    />

    <q-btn
      color="primary"
      label="ЗАДОЛЖЕННОСТЬ ПОКУПАТЕЛЕЙ"
      @click="router.push({ name: 'report-debt' })"
    />
    <q-btn
      color="primary"
      label="КАЛЕНДАРЬ ПРИХОДОВ"
      @click="router.push({ name: 'report-calendar' })"
    />
  </div>
  <router-view />
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
