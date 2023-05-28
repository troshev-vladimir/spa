<template>
  <FiltersContainer :filters="filters" @search="searchHandler()">
    <template v-slot="{ clearHandler }">
      <q-input dense v-model="filters.title" label="Событие" class="col-3" clearable @clear="clearHandler('title')" />
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
        clearable
        @clear="clearHandler('division_id')"
        :display-value="filters.division_id ? filters.division_id.title : 'Все'"
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
        @clear="clearHandler('user')"
        :display-value="filters.user ? filters.user.title : 'Все'"
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
    </template>
  </FiltersContainer>
</template>

<script setup>
import { computed, reactive, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import _ from "lodash";
import { useStore } from "vuex";
import DatePicker from "../UiKit/DatePicker";
import FiltersContainer from "@/components/Filters/FiltersContainer.vue";
import { useEvents } from "@/views/EventsView/composables/useEvents";
const router = useRouter();
const route = useRoute();
const store = useStore();
const filters = reactive({
  title: "",
  division_id: null,
  user: null,
  fulfilled: 3,
  date: {
    from: null,
    to: null,
  },
});
const { fetchAllEvents } = useEvents();
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

async function searchHandler() {
  await fetchAllEvents();
}

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

watch(
  filters,
  () => {
    const { date, ...allFilters } = filters;
    const preparedFilters = Object.assign({}, allFilters);
    preparedFilters.dateFrom = date.from;
    preparedFilters.dateTo = date.to;

    const query = {
      ...route.query,
      ..._.pickBy(preparedFilters, _.identity),
      ..._.pickBy(preparedFilters, (value) => value === ""),
    };
    router.replace({
      path: router.currentRoute.value.fullPath,
      query: _.pickBy(query, _.identity),
    });
  },
  { deep: true }
);
</script>

<style></style>
