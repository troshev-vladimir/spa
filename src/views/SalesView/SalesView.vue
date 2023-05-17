<template>
  <div class="container">
    <SalesFilter class="q-mb-md"></SalesFilter>
    <div class="col-3 q-mb-md">
      <q-btn @click="fetchAllSales"><q-icon class="text-primary" size="1.3em" name="fas fa-magnifying-glass" /></q-btn>
    </div>

    <q-table
      :loading="loadingDepartment"
      title="Cписок Продаж"
      :rows="store.state.sales.salesData"
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
              <q-btn class="q-mr-md" @click.stop="deleteHandler(row.row.id)"> Удалить </q-btn>
              <q-btn @click.stop="editHandler(row.row)">Редактировать</q-btn>
            </td>
            <td v-else-if="col.name === 'roles'">{{ col.value }}</td>
            <td v-else>{{ col.value }}</td>
          </template>
        </q-tr>
      </template>
    </q-table>
    <div class="row">
      <div class="col-12">
        <q-btn class="q-mt-md" @click.stop="addHandler()">
          <q-icon class="text-primary q-mr-md" size="1.3em" name="fas fa-plus" /> Добавить Продажу
        </q-btn>
      </div>
    </div>
    <SalesModal @sumbit="fetchAllSales"></SalesModal>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { useSales } from "./composables/useSales";
import { ref, onMounted, watch, computed } from "vue";
import usePagination from "../EventsView/composables/usePagination";
import SalesModal from "./SalesModal.vue";
import SalesFilter from "@/components/Sales/SalesFilter.vue";

const store = useStore();
const tableRef = ref(null);
const department = computed(() => store.state.department);
onMounted(async () => {
  if (store.state.department) {
    fetchAllSales();
  }
});

watch(department, async () => {
  tableRef.value.requestServerInteraction();
});
const { editHandler, addHandler, deleteHandler, fetchAllSales, loadingDepartment } = useSales(tableRef);
const { onRequest, pagination } = usePagination(store.dispatch.bind(this, "sales/fetchAllSales"), loadingDepartment);

const columns = [
  {
    name: "id",
    required: true,
    label: "№",
    align: "left",
    field: "id",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "placementDate",
    required: true,
    label: "placementDate",
    align: "left",
    field: "placementDate",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "payedDate",
    required: true,
    label: "payedDate",
    align: "left",
    field: "payedDate",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "start",
    required: true,
    label: "start ",
    align: "left",
    field: "start",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "end",
    required: true,
    label: "end ",
    align: "left",
    field: "end",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "client",
    required: true,
    label: "client ",
    align: "left",
    field: "client",
    format: (client) => `${client.name}`,
  },

  {
    name: "type",
    required: true,
    label: "type ",
    align: "left",
    field: "type",
    format: (type) => `${type.title}`,
  },

  {
    name: "actions",
    required: true,
    label: "Действия",
    align: "left",
    field: "name",
    format: (val) => `${val}`,
  },
];
</script>
