<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <q-btn class="q-mb-md" @click.stop="addHandler()">
          Добавить Продажу
        </q-btn>
      </div>
    </div>
    <div class="row items-start">
      <div class="col"><ClientFilter></ClientFilter></div>
      <div class="col">
        <q-btn size="md" @click="fetchAllSales">Найти</q-btn>
      </div>
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
            v-model="saleData.description"
            label="description"
            dense
            class="q-mb-md"
          />
          <q-select
            v-model="saleData.client_id"
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
            class="q-mb-xs"
            clearable
            options-dense
          />
          <q-select
            v-model="saleData.type"
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
            v-model="saleData.smi"
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
            <p>Продали такие штуки:</p>
            <ItemsRedactor
              v-model:items="saleItems"
              :item="{ title: '', summ: 0 }"
            />
          </div>
          <q-input
            filled
            dense
            v-model="saleData.payedDate"
            class="q-mb-md"
            label="payedDate"
          >
            <template v-slot:append>
              <q-icon name="edit" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="saleData.payedDate"
                    today-btn
                    mask="YYYY-MM-DD"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            filled
            dense
            v-model="saleData.placementDate"
            class="q-mb-md"
            label="placementDate"
          >
            <template v-slot:append>
              <q-icon name="edit" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="saleData.placementDate"
                    today-btn
                    mask="YYYY-MM-DD"
                  >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <div class="q-mb-md">
            <p>Даты рекламной компании:</p>
            <div>
              <q-badge v-if="AdCompany.from" class="q-mr-xs">{{
                AdCompany.from
              }}</q-badge>
              <q-badge v-if="AdCompany.to">{{ AdCompany.to }}</q-badge>
            </div>
            <q-date v-model="AdCompany" range mask="YYYY-MM-DD">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </div>

          <q-btn label="Submit" color="primary" @click="submitForm" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
            dense
          />
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { useSales } from "./composables/useSales";
import salesService from "@/api/sales";
import ClientFilter from "@/components/Clients/ClientsFilter.vue";
import { ref } from "vue";
import ItemsRedactor from "@/components/ItemsRedactor";
import { useClients } from "../EventsView/composables/useClients";
import usePagination from "../EventsView/composables/usePagination";

const { clients, onFilter } = useClients();
// import _ from "lodash";
// import axios from "@/api";
const tableRef = ref(null);
const loading = ref(false);
const store = useStore();
const modalConfig = ref({ status: false, action: null, name: "" });
const saleData = ref({
  id: null,
  placementDate: "",
  payedDate: "",
  start: "",
  end: "",
  user: "",
  saleItems: "",
  client: "",
  type: null,
  smi: "",
});
const saleItems = ref([{ title: "", summ: 0, amount: 1 }]);

const AdCompany = ref({});

const {
  editHandler,
  addHandler,
  deleteHandler,
  fetchAllSales,
  loadingDepartment,
} = useSales(modalConfig, saleData, saleItems, tableRef);
const { onRequest, pagination } = usePagination(
  store.dispatch.bind(this, "sales/fetchAllSales"),
  loadingDepartment
);
async function submitForm() {
  loading.value = true;
  try {
    if (modalConfig.value.action === "add") {
      saleData.value.userId = store.state.user.user.id;
      // saleData.value.clientId = saleData.value.client.id;
      saleData.value.type = saleData.value.type.id;
      // saleData.value.smi = saleData.value.smi.id;
      saleData.value.user = saleData.value.user.id;
      saleData.value.client = saleData.value.client.id;
      saleData.value.start = AdCompany.value.from;
      saleData.value.end = AdCompany.value.to;
      saleData.value.id_1c = 1;
      saleData.value.saleItems = saleItems.value;
      await salesService.create(saleData.value);
    } else if (modalConfig.value.action === "edit") {
      // saleData.value.clientId = saleData.value.client.id;
      saleData.value.type = saleData.value.type.id;
      // saleData.value.smi = saleData.value.smi.id;
      saleData.value.user = saleData.value.user.id;
      saleData.value.client = saleData.value.client.id;
      saleData.value.start = AdCompany.value.from;
      saleData.value.end = AdCompany.value.to;
      saleData.value.id_1c = 1;
      saleData.value.saleItems = saleItems.value;
      await salesService.update(saleData.value.id, saleData.value);
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
