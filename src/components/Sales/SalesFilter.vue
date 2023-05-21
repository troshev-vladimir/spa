<template>
  <div class="column">
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
        @clear="clearHandler('user')"
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
    <q-btn @click="resetAllFilters" dense class="q-mt-sm q-ml-auto">
      <q-icon class="text-primary q-mr-sm" size="1.2em" name="fa-solid fa-xmark" />
      Сбросить фильтры
    </q-btn>
  </div>
</template>

<script setup>
import { onMounted, reactive, watch, computed, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
import _ from "lodash";
import DatePicker from "../UiKit/DatePicker";
import { useStore } from "vuex";
const router = useRouter();
const route = useRoute();
const store = useStore();

let filters = reactive({
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

async function resetAllFilters() {
  Object.keys(filters).forEach(
    (el) =>
      (filters[el] =
        typeof filters[el] === "object" && filters[el] !== null
          ? {
              from: null,
              to: null,
            }
          : "")
  );

  await nextTick();

  const newQuery = _.pickBy(route.query, (el, key) => {
    return !Object.keys(filters).includes(key);
  });
  router.replace({
    path: route.path,
    query: newQuery,
  });
}
const divisions = computed(() => store.state.department?.divisions);
const onFilterUsers = async (val, update) => {
  await store.dispatch("users/fetchAllUsers");
  update();
};

async function clearHandler(e) {
  const newQuery = _.pickBy(route.query, (el, key) => {
    return key !== e;
  });
  await nextTick();
  router.replace({
    path: route.path,
    query: newQuery,
  });
}
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
