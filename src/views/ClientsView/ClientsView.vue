<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <q-btn class="q-mb-md" @click.stop="addHandler()">
          Добавить клиента
        </q-btn>
      </div>
    </div>
    <div class="row items-start">
      <div class="col"><ClientFilter></ClientFilter></div>
      <div class="col">
        <q-btn size="sm" @click="fetchAllClients">Отправить запрос</q-btn>
      </div>
    </div>

    <q-table
      :loading="loadingDepartment"
      :rows-per-page-options="[1, 3, 10, 15]"
      title="Cписок Клиентов"
      :rows="store.state.clients.clientsData"
      :columns="columns"
      v-model:pagination="pagination"
      row-key="name"
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
      <q-card class="q-pa-md">
        <q-toolbar>
          <q-toolbar-title>{{ modalConfig.name }}</q-toolbar-title>

          <q-btn flat round dense v-close-popup>&times;</q-btn>
        </q-toolbar>
        <q-spinner color="primary" size="3em" :thickness="2" v-if="loading" />
        <q-form autofocus style="min-width: 400px">
          <q-input
            filled
            v-model="userData.name"
            label="Имя"
            class="q-mb-md"
            dense
          />
          <q-input
            filled
            v-model="userData.email"
            label="Email"
            class="q-mb-md"
            dense
          />
          <q-input
            filled
            v-model="userData.phone"
            label="Телефон"
            class="q-mb-md"
            dense
          />
          <q-input
            filled
            v-model="userData.phone_add"
            label="Дополнительный телефон"
            class="q-mb-md"
            dense
          />
          <q-input
            filled
            v-model="userData.site"
            label="Сайт"
            class="q-mb-md"
            dense
          />
          <q-input
            filled
            v-model="userData.vk"
            label="Вконтакте"
            class="q-mb-md"
            dense
          />

          <q-select
            v-model="userData.division_id"
            :options="store.state.department?.divisions"
            label="Отдел"
            map-options
            emit-value
            option-value="id"
            option-label="name"
            dense
            filled
            class="q-mb-md"
          />

          <VueDadata v-model="query" :token="token"></VueDadata>

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
import { ref } from "vue";
import { useStore } from "vuex";
import { useClients } from "./composables/useClients";
import clientService from "@/api/clients";
import ClientFilter from "@/components/Clients/ClientsFilter.vue";
import { VueDadata } from "vue-dadata";
import "vue-dadata/dist/style.css";

const loading = ref(false);
const store = useStore();
const modalConfig = ref({ status: false, action: null, name: "" });
const userData = ref({
  id: null,
  name: "",
  email: "",
  phone: "",
  phone_add: "",
  site: "",
  vk: "",
  birth_day: "",
  division_id: "",
});
const query = ref("");
const token = "3015b65404c060dcc9aacd5732122a53d87d1294";
const {
  editHandler,
  addHandler,
  deleteHandler,
  loadingDepartment,
  fetchAllClients,
} = useClients(modalConfig, userData);

async function submitForm() {
  loading.value = true;
  try {
    if (modalConfig.value.action === "add") {
      userData.value.userId = store.state.user.user.id;
      await clientService.create(userData.value);
    } else if (modalConfig.value.action === "edit") {
      await clientService.update(userData.value.id, userData.value);
    }
  } catch (error) {
    console.log(error);
  } finally {
    modalConfig.value.status = false;
    loading.value = false;
    fetchAllClients();
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
    name: "name",
    required: true,
    label: "Имя",
    align: "left",
    field: "name",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "email",
    required: true,
    label: "email",
    align: "left",
    field: "email",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "phone",
    required: true,
    label: "Телефон ",
    align: "left",
    field: "phone",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "actions",
    required: true,
    label: "Действия",
    align: "left",
    field: "name",
    format: (val) => `${val}`,
    sortable: true,
  },
];
const pagination = ref({
  rowsPerPage: 10,
});
</script>
