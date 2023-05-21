<template>
  <div>
    <q-form class="row q-col-gutter-md">
      <q-input dense v-model="filters.title" label="Имя" class="col-3" />
      <DatePicker v-model="filters.createdDate" label="Дата создания" range class="col-3" />
      <DatePicker v-model="filters.placementDate" label="Дата размещения" range class="col-3" />
      <DatePicker v-model="filters.payedDate" label="Дата оплаты" range class="col-3" />
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
        options-dense
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
        v-model="filters.smi"
        :options="store.state.sales.salesSmi"
        label="СМИ"
        dense
        option-value="id"
        option-label="title"
        map-options
        emit-value
        class="col-3"
      />
      <q-select
        v-model="filters.type"
        :options="store.state.sales.salesTypes"
        label="Тип продажи"
        dense
        option-value="id"
        option-label="title"
        map-options
        emit-value
        class="col-3"
      />
    </q-form>
    <q-btn @click="resetAllFilters">Сбросить все фильтры</q-btn>
  </div>
</template>

<script setup>
import { onMounted, reactive, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import _ from "lodash";
import DatePicker from "../UiKit/DatePicker";
import { useStore } from "vuex";
const router = useRouter();
const route = useRoute();
const store = useStore();

const filters = reactive({
  title: "",
  createdDate: {
    from: null,
    to: null,
  },
  placementDate: {
    from: null,
    to: null,
  },
  payedDate: {
    from: null,
    to: null,
  },
  type: null,
  smi: null,
  division_id: null,
  user: null,
});

function resetAllFilters() {
  const newQuery = _.pickBy(route.query, (el, key) => {
    filters[key] = typeof filters[key] === "object" ? {} : null;
    return !Object.keys(filters).includes(key);
  });
  router.push({
    path: router.currentRoute.value.fullPath,
    query: newQuery,
  });
}
const divisions = computed(() => store.state.department?.divisions);
const onFilterUsers = async (val, update) => {
  await store.dispatch("users/fetchAllUsers");
  update();
};
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
    const { createdDate, placementDate, payedDate, ...allFilters } = filters;
    const preparedFilters = Object.assign({}, allFilters);
    preparedFilters.createdFrom = createdDate.from;
    preparedFilters.createdTo = createdDate.to;
    preparedFilters.placementFrom = placementDate.from;
    preparedFilters.placementTo = placementDate.to;
    preparedFilters.payedFrom = payedDate.from;
    preparedFilters.payedTo = payedDate.to;
    router.push({
      path: router.currentRoute.value.fullPath,
      query: { ...route.query, ..._.pickBy(preparedFilters, _.identity) },
    });
  },
  { deep: true }
);
</script>

<style></style>
