<template>
  <div class="container">
    <div class="items-start">
      <q-form class="row q-mb-lg q-gutter-md">
        <q-input dense v-model="filters.inn" label="инн" class="col-3" />
        <q-input filled dense v-model="dateInput" class="col-3">
          <template v-slot:append>
            <q-icon name="edit" class="cursor-pointer">
              <q-popup-proxy
                cover
                transition-show="scale"
                transition-hide="scale"
              >
                <q-date v-model="filters.date" mask="DD.MM.YYYY" range>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <div class="col">
          <q-btn size="md" @click="applyFilters">Найти</q-btn>
        </div>
      </q-form>
    </div>

    <q-table
      :loading="loadingDepartment"
      title="Cписок Продаж"
      :rows="store.state.incomes.incomesData.DATA"
      :columns="columns"
      v-model:pagination="pagination"
      :rows-per-page-options="[0, 2, 5]"
      row-key="name"
      @request="onRequest"
      ref="tableRef"
    >
      <template v-slot:body="row">
        <q-tr @click="showUserModal(row.row)" class="cursor-pointer">
          <template v-for="col in row.cols" :key="col.name">
            <td v-if="col.name === 'actions'">
              <q-btn class="q-mr-md" @click.stop="deleteHandler(row.row.id)">
                Удалить
              </q-btn>
              <q-btn @click.stop="editHandler(row.row)">Редактировать</q-btn>
            </td>
            <td v-else-if="col.name === 'roles'">{{ col.value }}</td>
            <td v-else>{{ col.value }}</td>
          </template>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { useIncomes } from "./composables/useIncomes";
import { reactive, ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
// import _ from "lodash";
// import axios from "@/api";
const tableRef = ref(null);
const loading = ref(false);
const store = useStore();
const router = useRouter();
const route = useRoute();
const filters = reactive({
  inn: "",
  date: {
    from: null,
    to: null,
  },
});

const dateInput = computed(() => {
  if (typeof filters.date === "object") {
    return filters.date.from
      ? `${filters.date.from} - ${filters.date.to}`
      : "Не выбрано";
  } else {
    return filters.date;
  }
});
const { loadingDepartment } = useIncomes(filters);
async function applyFilters() {
  await store.dispatch("incomes/fetchAllIncomes", filters);
}
const columns = [
  {
    name: "ID",
    required: true,
    label: "ID",
    align: "left",
    field: "ID",
    format: (val) => `${val}`,
    sortable: true,
  },

  {
    name: "Контрагент",
    required: true,
    label: "Контрагент",
    align: "left",
    field: "Контрагент",
    format: (val) => `${val}`,
    sortable: true,
  },

  {
    name: "Назначение",
    required: true,
    label: "Назначение",
    align: "left",
    field: "Назначение",
    format: (val) => `${val}`,
    sortable: true,
  },

  {
    name: "Номер",
    required: true,
    label: "Номер",
    align: "left",
    field: "Номер",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Сумма",
    required: true,
    label: "Сумма",
    align: "left",
    field: "Сумма",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "Дата",
    required: true,
    label: "Дата",
    align: "left",
    field: "Дата",
    format: (val) => `${val}`,
    sortable: true,
  },
];
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 3,
  rowsNumber: 0,
});

async function onRequest(props) {
  const { page, rowsPerPage } = props.pagination;
  //sortBy, descending
  // const filter = props.filter;

  const query = Object.assign({}, route.query, {
    page,
    per_page: rowsPerPage,
  });

  router.push({
    path: router.currentRoute.value.fullPath,
    query,
  });

  loading.value = true;

  console.log(rowsPerPage, route.query);

  const returnedData = store.state.incomes.incomesData;
  pagination.value.page = returnedData.PAGE;
  pagination.value.rowsNumber = returnedData.ALLROWS;

  loading.value = false;
}
</script>
