<template>
  <q-form class="row q-mb-lg q-gutter-md">
    <q-input dense v-model="filters.name" label="Имя" class="col-5" />
    <q-select
      v-model="filters.division_id"
      :options="divisions"
      label="Выберите отдел"
      option-value="id"
      option-label="name"
      dense
      map-options
      emit-value
      class="col-6"
    />
  </q-form>
</template>

<script setup>
import { computed, onMounted, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import _ from "lodash";

const store = useStore();
const router = useRouter();

const filters = reactive({
  name: "",
  division_id: null,
});

const divisions = computed(() => store.state.department?.divisions);
watch(divisions, () => {
  filters.division_id = divisions.value[0].id;
});

onMounted(() => {
  const itsFilters = Object.keys(filters);
  const searchParams = new URLSearchParams(router.currentRoute.value.query);
  searchParams.forEach((value, key) => {
    if (itsFilters.includes(key)) {
      if (key === "division_id") {
        filters[key] = Number(value);
        return;
      }
      filters[key] = value;
    }
  });
}),
  watch(
    filters,
    () => {
      router.push({
        path: router.currentRoute.value.fullPath,
        query: _.pickBy(filters, _.identity),
      });
    },
    { deep: true }
  );
</script>

<style></style>
