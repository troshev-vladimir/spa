<template>
  <div class="column">
    <q-form class="row q-col-gutter-md">
      <slot :clearHandler="clearHandler" />
    </q-form>
  </div>
  <div class="row q-mb-md q-mt-sm items-start">
    <div class="col-3">
      <q-btn @click="emit('search')">
        <span class="q-mr-sm">Найти</span>
        <q-icon class="text-primary" size="1.3em" name="fas fa-magnifying-glass" />
      </q-btn>

      <slot name="buttons"></slot>
    </div>
    <q-btn @click="resetAllFilters" dense class="q-ml-auto">
      <q-icon class="text-primary q-mr-sm" size="1.2em" name="fa-solid fa-xmark" />
      Сбросить фильтры
    </q-btn>
  </div>
</template>

<script setup>
import useFilters from "./useFilter";
// eslint-disable-next-line no-undef
const props = defineProps({
  filters: {
    type: Array,
  },
});
// eslint-disable-next-line no-undef
const emit = defineEmits(["search"]);

const { resetAllFilters, clearHandler } = useFilters(props.filters);
</script>

<style></style>
