<template>
  <div>
    <q-form class="row q-col-gutter-md">
      <q-input dense v-model="filters.title" label="Имя" class="col-3" />
      <q-select
        v-model="filters.fulfilled"
        :options="fulfilledOptions"
        label="Статус"
        dense
        map-options
        emit-value
        class="col-3"
      />

      <DatePicker v-model="filters.date" range class="col-3" />
      <div class="col-3"><q-btn>Найти</q-btn></div>
    </q-form>
  </div>
</template>

<script setup>
import { onMounted, reactive, watch } from "vue";
import { useRouter } from "vue-router";
import _ from "lodash";
import DatePicker from "../UiKit/DatePicker";
const router = useRouter();

const filters = reactive({
  title: "",
  division_id: null,
  date: {
    from: null,
    to: null,
  },
});

const fulfilledOptions = [
  {
    value: 0,
    label: "Не выбрано",
  },
  {
    value: true,
    label: "Завершонные",
  },

  {
    value: false,
    label: "Не завершонные",
  },
];
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
