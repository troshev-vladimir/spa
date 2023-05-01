<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <q-btn class="q-mb-md" @click.stop="addHandler()">
          Добавить Продажу
        </q-btn>
      </div>
    </div>
    <div class="row items-start"></div>

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

    <q-dialog v-model="modalConfig.status">
      <q-card class="q-pa-md" style="width: 1200px">
        <q-toolbar>
          <q-toolbar-title>{{ modalConfig.name }}</q-toolbar-title>

          <q-btn flat round dense v-close-popup>&times;</q-btn>
        </q-toolbar>
        <q-spinner color="primary" size="3em" :thickness="2" v-if="loading" />
        <q-form autofocus style="min-width: 400px">
          <q-input
            filled
            v-model="saleData.title"
            label="Название"
            dense
            class="q-mb-md"
          />
          <q-select
            v-model="saleData.client"
            :options="clients"
            @filter="onFilter"
            label="Клиент"
            aria-placeholder="sdf"
            map-options
            emit-value
            option-value="id"
            option-label="name"
            dense
            filled
            use-input
            input-debounce="1000"
            class="q-mb-md"
            clearable
            options-dense
          />

          <q-select
            v-model="saleData.type_id"
            :options="store.state.sales.salesTypes"
            label="Тип"
            map-options
            emit-value
            option-value="id"
            option-label="title"
            dense
            filled
            class="q-mb-md"
          />
          <q-select
            v-model="saleData.smi_id"
            :options="store.state.sales.salesSmi"
            label="СМИ"
            map-options
            emit-value
            option-value="id"
            option-label="title"
            dense
            filled
            class="q-mb-md"
          />
          <div class="q-pa-md q-mb-md">
            <p>Услуги</p>
            <ItemsRedactor
              v-model:items="saleItems"
              :item="{ title: '', summ: null }"
            />
          </div>
          <DatePicker
            v-model="saleData.payedDate"
            filled
            dense
            class="q-mb-md"
            label="Дата оплаты"
          />
          <DatePicker
            v-model="saleData.placementDate"
            filled
            dense
            class="q-mb-md"
            label="Дата размеещения"
          />

          <div class="q-mb-md">
            <p>Даты рекламной компании:</p>
            <div>
              <q-badge v-if="adCompany.from" class="q-mr-xs">{{
                adCompany.from
              }}</q-badge>
              <q-badge v-if="adCompany.to">{{ adCompany.to }}</q-badge>
            </div>
            <q-date v-model="adCompany" range mask="YYYY-MM-DD">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </div>

          <q-btn label="Submit" color="primary" @click="submitForm" />
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { useSales } from "./composables/useSales";
import salesService from "@/api/sales";
import { ref } from "vue";
import ItemsRedactor from "@/components/ItemsRedactor";
import { useClients } from "../EventsView/composables/useClients";
import usePagination from "../EventsView/composables/usePagination";

const { clients, onFilter } = useClients();
const tableRef = ref(null);
const loading = ref(false);
const store = useStore();
const modalConfig = ref({ status: false, action: null, name: "" });
const saleData = ref({
  id: null,
  placement_date: "",
  payed_date: "",
  start: "",
  end: "",
  id_1c: null,
  user: "",
  sale_items: "",
  client_id: "",
  type_id: null,
  smi_id: "",
  title: "",
  summa: "",
  locked: "",
});

const {
  editHandler,
  addHandler,
  deleteHandler,
  fetchAllSales,
  loadingDepartment,
  saleItems,
  adCompany,
} = useSales(modalConfig, tableRef, saleData);
const { onRequest, pagination } = usePagination(
  store.dispatch.bind(this, "sales/fetchAllSales"),
  loadingDepartment
);

async function submitForm() {
  loading.value = true;
  try {
    if (modalConfig.value.action === "add") {
      const { client, ...payload } = saleData.value;
      payload.start = adCompany.value.from;
      payload.end = adCompany.value.to;
      payload.client_id = client;
      payload.user_id = store.state.user.user.id;
      payload.id_1c = 1; // TODO откуда взять 1c id
      payload.saleItems = saleItems.value;
      await salesService.create(payload);
    } else if (modalConfig.value.action === "edit") {
      const { client, id, user, ...payload } = saleData.value;
      payload.start = adCompany.value.from;
      payload.end = adCompany.value.to;
      payload.client_id = client.id;
      payload.user_id = user.id;
      payload.saleItems = saleItems.value;
      await salesService.update(id, payload);
    }
  } catch (error) {
    console.log(error);
  } finally {
    modalConfig.value.status = false;
    loading.value = false;
    fetchAllSales();
  }
}

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
