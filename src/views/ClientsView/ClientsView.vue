<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <q-btn class="q-mb-md" @click.stop="addHandler()">
          Добавить клиента
        </q-btn>
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

        <q-form autofocus style="min-width: 400px">
          <q-input filled v-model="userData.name" label="Имя" class="q-mb-md" />
          <q-input
            filled
            v-model="userData.email"
            label="Email"
            class="q-mb-md"
          />
          <q-input
            filled
            v-model="userData.phone"
            label="Телефон"
            class="q-mb-md"
          />
          <q-input
            filled
            v-model="userData.phone_add"
            label="Дополнительный телефон"
            class="q-mb-md"
          />
          <q-input
            filled
            v-model="userData.site"
            label="Сайт"
            class="q-mb-md"
          />
          <q-input
            filled
            v-model="userData.vk"
            label="Вконтакте"
            class="q-mb-md"
          />

          <q-btn label="Submit" color="primary" @click="submitForm" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useStore } from "vuex";
import useFetchClients from "./composables/useFetchClients";
import useEditClients from "./composables/useEditClients";
import useAddClients from "./composables/useAddClients";
import clientService from "@/api/clients";

const store = useStore();
const modalConfig = ref({});
const userData = ref({
  id: null,
  name: "",
  email: "",
  phone: "",
  phone_add: "",
  site: "",
  vk: "",
  birth_day: "",
  division: "",
});

const { loadingDepartment } = useFetchClients();
const { editHandler } = useEditClients(modalConfig, userData);
const { addHandler } = useAddClients(modalConfig, userData);

async function submitForm() {
  if (modalConfig.value.action === "add") {
    const responce = await clientService.create(userData.value);
    console.log("responce", responce);
  } else if (modalConfig.value.action === "edit") {
    clientService.update(userData.value.id, userData.value);
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

<style scoped lang="scss">
.buttons {
  column-gap: 20px;
  margin-bottom: 20px;
}
</style>
