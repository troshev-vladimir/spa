<template>
  <div>
    <q-form class="row q-col-gutter-md">
      <q-input dense v-model="filters.title" label="Событие" class="col-3" />
      <q-select
        v-model="filters.division_id"
        :options="divisions"
        label="Выберите отдел"
        option-value="id"
        option-label="name"
        dense
        map-options
        emit-value
        class="col-3"
      />

      <q-select
        v-model="filters.user"
        :options="store.state.users.usersData"
        label="Ответствееный"
        option-value="id"
        option-label="login"
        dense
        map-options
        emit-value
        class="col-3"
        clearable
        @filter="onFilterUsers"
        input-debounce="0"
        use-input
        options-dense
      />
      <q-select
        v-model="filters.fulfilled"
        :options="fulfilledOptions"
        label="Статус"
        dense
        map-options
        emit-value
        class="col-3"
      />
      <DatePicker v-model="filters.date" label="Промежуток времени" range class="col-3" />
    </q-form>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import _ from "lodash";
import { useStore } from "vuex";
import DatePicker from "../UiKit/DatePicker";

const router = useRouter();
const route = useRoute();
const store = useStore();
const filters = reactive({
  title: "",
  division_id: null,
  user: null,
  fulfilled: null,
  date: {
    from: null,
    to: null,
  },
});
const divisions = computed(() => store.state.department?.divisions);
const onFilterUsers = async (val, update) => {
  await store.dispatch("users/fetchAllUsers");
  update();
};

const fulfilledOptions = [
  {
    value: 1,
    label: "Завершонные без результата",
  },
  {
    value: 2,
    label: "Завершонные c результатом",
  },
  {
    value: 3,
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
});
watch(
  filters,
  () => {
    const { date, ...allFilters } = filters;
    const preparedFilters = Object.assign({}, allFilters);
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
