<template>
  <FiltersContainer v-slot="{ clearHandler }" :filters="filters" @search="fetchAllSales()">
    <q-input dense v-model="filters.title" label="Имя" class="col-3" clearable @clear="clearHandler('title')" />
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
      :display-value="filters.user ? filters.user.name : 'Все'"
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
      clearable
      @clear="clearHandler('smi')"
      :display-value="filters.smi ? filters.smi.title : 'Все'"
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
      :display-value="filters.type ? filters.type.title : 'Все'"
    />
  </FiltersContainer>
</template>

<script setup>
import FiltersContainer from "@/components/Filters/FiltersContainer.vue";
import { reactive, watch, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import _ from "lodash";
import DatePicker from "../UiKit/DatePicker";
import { useStore } from "vuex";
import { useSales } from "@/views/SalesView/composables/useSales";
const { fetchAllSales } = useSales();

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
const divisions = computed(() => store.state.department?.divisions);
const onFilterUsers = async (val, update) => {
  await store.dispatch("users/fetchAllUsers");
  update();
};

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
