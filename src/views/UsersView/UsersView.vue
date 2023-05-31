<template>
  <q-form class="row q-mb-lg q-gutter-md">
    <q-input dense v-model="userLogin" label="Login" class="col-3" />
    <q-select
      v-model="userRole"
      :options="allRoles"
      label="Выберите роль"
      option-value="id"
      option-label="name"
      dense
      class="col-3"
    />
    <q-btn dense size="sm" @click="sendFilters">Отправить запрос</q-btn>
  </q-form>
  <q-table
    :rows-per-page-options="[1, 3, 10, 15]"
    title="Cписок пользователей"
    :rows="store.state.users.usersData"
    :columns="columns"
    v-model:pagination="pagination"
    row-key="name"
    :loading="usersLoading"
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

  <q-dialog v-model="editModalStatus">
    <q-card class="q-pa-md" style="max-width: initial">
      <q-toolbar>
        <q-toolbar-title>Редактирование пользователя</q-toolbar-title>

        <q-btn flat round dense v-close-popup><q-icon class="text-primary" size="1.5em" name="fas fa-xmark" /></q-btn>
      </q-toolbar>

      <q-form autofocus style="min-width: 600px">
        <q-input filled v-model="editUserLogin" label="Login" class="q-mb-md" />

        <div>
          <q-btn label="Submit" color="primary" @click="submitForm" />
        </div>
      </q-form>

      <div class="q-mt-md">
        <b>Роли пользователя</b>
        <div class="q-mb-md">
          <span v-for="role in editUserRoles" :key="role" class="q-mr-md">
            {{ role.name }}
          </span>
          <span v-if="!editUserRoles.length"> Нет ролей </span>
        </div>
        <div class="row q-gutter-md">
          <q-select
            v-model="roleModal"
            :options="allRoles"
            label="Выберите роль"
            option-value="id"
            option-label="name"
            class="col-grow"
            dense
          />
          <q-btn :disable="roleModal" dense @click="removeRole">удалить</q-btn>
          <q-btn :disable="roleModal" dense @click="addRole">Добавить</q-btn>
        </div>
      </div>

      <div class="q-mt-md">
        <b>Департаменты пользователя</b>
        <div class="q-mb-md">
          <span v-for="department in editUserDepartments" :key="department.id" class="q-mr-md">
            {{ department.name }}
          </span>
          <span v-if="!editUserDepartments.length"> Нет назначеных департаментов </span>
        </div>
        <div class="row q-gutter-md">
          <q-select
            v-model="departmentsModal"
            :options="allDepartments"
            label="Выберите Департамент"
            option-value="id"
            option-label="name"
            class="col-grow"
            dense
          />
          <q-btn :disable="departmentsModal" dense @click="detachDepartment">удалить</q-btn>
          <q-btn :disable="departmentsModal" dense @click="attachDepartment">Добавить</q-btn>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useStore } from "vuex";
import useEditUser from "./composables/useEditUser";
import useFilters from "./composables/useFilters";
import useFetchUsers from "./composables/useFetchUsers";
// import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { ref } from "vue";
import userService from "@/api/users";
const store = useStore();
const $q = useQuasar();

const pagination = ref({
  rowsPerPage: 10,
});
const { usersLoading } = useFetchUsers();
const {
  editHandler,
  editModalStatus,
  editUserLogin,
  editUserRoles,
  roleModal,
  addRole,
  allRoles,
  removeRole,
  submitForm,
  allDepartments,
  departmentsModal,
  editUserDepartments,
  attachDepartment,
  detachDepartment,
} = useEditUser();

const { userLogin, userRole, sendFilters } = useFilters(pagination);

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
