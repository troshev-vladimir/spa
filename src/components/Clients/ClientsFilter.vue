<template>
  <q-form class="row q-mb-lg q-gutter-md">
    <q-input dense v-model="filters.clientName" label="Имя" class="col-3" />
    <q-select
      v-model="filters.division"
      :options="store.state.department?.divisions"
      label="Выберите отдел"
      option-value="id"
      option-label="name"
      dense
      map-options
      emit-value
      class="col-3"
    />
    <q-btn dense size="sm" @click="sendFilters">Отправить запрос</q-btn>
  </q-form>
</template>

<script setup>
import { reactive } from "vue";
import { useStore } from "vuex";
const store = useStore();

const filters = reactive({
  clientName: "",
  division: "",
});
</script>

<style></style>
