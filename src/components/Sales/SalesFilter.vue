<template>
  <div>
    <q-form class="row q-col-gutter-md">
      <q-input dense v-model="filters.title" label="Имя" class="col-4" />
      <DatePicker v-model="filters.date" label="Промежуток времени" range class="col-4" />
    </q-form>
  </div>
</template>

<script setup>
import { onMounted, reactive, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import _ from "lodash";
import DatePicker from "../UiKit/DatePicker";
const router = useRouter();
const route = useRoute();

const filters = reactive({
  title: "",
  date: {
    from: null,
    to: null,
  },
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
});
watch(
  filters,
  () => {
    const { date, ...allFilters } = filters;
    const preparedFilters = Object.assign({}, allFilters);
    console.log(allFilters);
    preparedFilters.dateFrom = date.from;
    preparedFilters.dateTo = date.to;
    router.push({
      path: router.currentRoute.value.fullPath,
      query: { ...route.query, ..._.pickBy(preparedFilters, _.identity) },
    });
  },
  { deep: true }
);
</script>

<style></style>
