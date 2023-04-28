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
          <q-btn size="md" @click="fetchAllIncomes">Найти</q-btn>
        </div>
      </q-form>
    </div>

    <q-table
      flat
      bordered
      :loading="loadingDepartment"
      title="Cписок Поступлений"
      :rows="store.state.incomes.incomesData.DATA"
      :columns="columns"
      v-model:pagination="pagination"
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
import { reactive, ref, computed, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
// import _ from "lodash";
// import axios from "@/api";
const tableRef = ref(null);
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

onMounted(() => {
  store.commit("incomes/setIncomes", []);
  const query = Object.assign(
    {},
    {
      page: 1,
      per_page: pagination.value.rowsPerPage,
    },
    route.query
  );
  router.replace({
    path: router.currentRoute.value.fullPath,
    query,
  });
});

const loadingDepartment = ref(false);

filters.date.from = route.query.from;
filters.date.to = route.query.to;
filters.inn = route.query.inn;

watch(filters, (filter) => {
  const query = Object.assign({}, route.query, {
    inn: filter.inn,
    from: filter.date.from,
    to: filter.date.to,
    page: 1,
  });

  router.replace({
    path: router.currentRoute.value.fullPath,
    query,
  });
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

async function fetchAllIncomes() {
  const response = await store.dispatch("incomes/fetchAllIncomes", filters);
  pagination.value.page = Number(response.PAGE);
  pagination.value.rowsNumber = response.ALLROWS;
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
  rowsPerPage: 5,
  rowsNumber: 0,
  rowsPerPageOptions: [2, 5, 10],
});

async function onRequest(props) {
  const { page, rowsPerPage } = props.pagination;

  const query = Object.assign({}, route.query, {
    page,
    per_page: rowsPerPage,
  });

  router.replace({
    path: router.currentRoute.value.fullPath,
    query,
  });

  loadingDepartment.value = true;
  pagination.value.rowsPerPage = rowsPerPage;

  const response = await store.dispatch("incomes/fetchAllIncomes", filters);
  pagination.value.page = Number(response.PAGE);
  pagination.value.rowsNumber = response.ALLROWS;

  loadingDepartment.value = false;
}
</script>
