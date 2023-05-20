<template>
  <q-form class="row q-mb-lg q-col-gutter-md">
    <q-input dense v-model="filters.name" label="Имя" class="col-4" />
    <q-select
      v-model="filters.division_id"
      :options="divisions"
      label="Выберите отдел"
      option-value="id"
      option-label="name"
      dense
      map-options
      emit-value
      class="col-4"
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
      class="col-4"
      clearable
      @filter="onFilterUsers"
      input-debounce="0"
      use-input
      options-dense
    />

    <q-select
      v-model="filters.potential"
      :options="store.state.clients.metadata.potentials"
      label="Потенциал"
      option-value="id"
      option-label="title"
      dense
      map-options
      emit-value
      class="col-4"
      clearable
    />
    <q-select
      v-model="filters.activity"
      :options="store.state.clients.metadata.activitys"
      label="Род деятельности"
      option-value="id"
      option-label="title"
      dense
      map-options
      emit-value
      class="col-4"
      clearable
    />
    <q-select
      v-model="attributes"
      multiple
      :options="['active', 'federal', 'top', 'prioritet']"
      use-chips
      clearable
      label="Аттрибуты"
      class="col-4"
      dense
    />
  </q-form>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import _ from "lodash";

const store = useStore();
const router = useRouter();
const route = useRoute();
const attributes = ref([]);
const filters = reactive({
  name: "",
  division_id: null,
  user: null,
  potential: null,
  activity: null,
});

const onFilterUsers = async (val, update) => {
  console.log(val);
  await store.dispatch("users/fetchAllUsers");
  update();
};

const divisions = computed(() => store.state.department?.divisions);
watch(divisions, () => {
  filters.division_id = divisions.value[0]?.id;
});

onMounted(() => {
  const itsFilters = Object.keys(filters);
  const searchParams = new URLSearchParams(router.currentRoute.value.query);
  searchParams.forEach((value, key) => {
    if (itsFilters.includes(key)) {
      if (key === "division_id" || key === "user" || key === "potential" || key === "activity") {
        filters[key] = Number(value);
        return;
      }

      filters[key] = value;
    }

    if ((key === "active" || key === "federal" || key === "top" || key === "prioritet") && +value) {
      attributes.value.push(key);
      return;
    }
  });
});
watch(
  filters,
  () => {
    router.replace({
      path: router.currentRoute.value.fullPath,
      query: Object.assign({}, route.query, _.pickBy(filters, _.identity)),
    });
  },
  { deep: true }
);

watch(
  attributes,
  () => {
    router.replace({
      path: router.currentRoute.value.fullPath,
      query: Object.assign({}, route.query, {
        active: +attributes.value.includes("active"),
        federal: +attributes.value.includes("federal"),
        top: +attributes.value.includes("top"),
        prioritet: +attributes.value.includes("prioritet"),
      }),
    });
  },
  { deep: true }
);
</script>

<style></style>
