<template>
  <q-table
    title="Cписок пользователей"
    :rows="store.state.users.usersData"
    :columns="columns"
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

  <q-dialog v-model="editModalStatus">
    <q-card class="q-pa-md">
      <q-toolbar>
        <q-toolbar-title>Редактирование пользователя</q-toolbar-title>

        <q-btn flat round dense v-close-popup>&times;</q-btn>
      </q-toolbar>

      <q-form autofocus>
        <q-input filled v-model="editUserLogin" label="Login" class="q-mb-md" />

        <b>Роли пользователя</b>
        <div class="q-mb-md">
          <span v-for="role in editUserRoles" :key="role" class="q-mr-md">
            {{ role.name }}
          </span>
          <span v-if="!editUserRoles.length"> Нет ролей </span>
        </div>
        <div class="row">
          <q-select
            v-model="roleModal"
            :options="allRoles"
            label="Выберите роль"
            option-value="id"
            option-label="name"
            class="col-grow"
            dense
          />
          <q-btn dense @click="removeRole">удалить</q-btn>
          <q-btn dense @click="addRole">Добавить</q-btn>
        </div>

        <div>
          <q-btn label="Submit" color="primary" @click="submitForm" />
          <q-btn
            label="Reset"
            type="reset"
            color="primary"
            flat
            class="q-ml-sm"
          />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useStore } from "vuex";
import useEditUser from "./composables/useEditUser";
// import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { onMounted } from "vue";
import userService from "@/api/users";
const store = useStore();
const $q = useQuasar();

const {
  editHandler,
  editModalStatus,
  editUserLogin,
  editUserRoles,
  roleModal,
  addRole,
  removeRole,
  allRoles,
  submitForm,
} = useEditUser();

onMounted(() => {
  store.dispatch("users/fetchAllUsers");
});

async function deleteHandler(id) {
  try {
    userService.delete(id);
  } catch (error) {
    console.log(error);
  }

  store.dispatch("users/fetchAllUsers");
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
    name: "login",
    required: true,
    label: "Логин",
    align: "left",
    field: "login",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "roles",
    required: true,
    label: "Роли",
    align: "left",
    field: "roles",
    format: (val) => val.map((el) => " " + el.name).toString(),
    sortable: false,
  },
  {
    name: "created_at",
    required: true,
    label: "Дата создания",
    align: "center",
    field: "created_at",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "actions",
    required: true,
    label: "Действия",
    align: "left",
    field: "actions",
    format: (val) => `${val}`,
    sortable: true,
  },
];

function showUserModal(data) {
  const elements = Object.entries(data);

  let templateHtml = "";

  for (const row of elements) {
    templateHtml += `
    <div style="border-bottom: 1px dashed #666;" class="row justify-between q-mb-md">
      <b>${row[0]}</b>
      <span>${row[1]}</span>
    </div>`;
  }

  $q.dialog({
    title: data.name,
    message: templateHtml,
    html: true,
  });
}
</script>
