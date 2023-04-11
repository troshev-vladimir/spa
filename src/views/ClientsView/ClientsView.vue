<template>
  <div class="container">
    <q-form class="row q-mb-lg q-gutter-md">
      <q-input dense label="Имя клиента" class="col-3" />
      <q-select
        :options="[
          {
            name: 'Отдел №1',
            id: 1,
          },
          {
            name: 'Отдел №2',
            id: 2,
          },
        ]"
        label="Отдел"
        option-value="id"
        option-label="name"
        dense
        class="col-3"
      />
      <q-btn dense size="sm">Отправить запрос</q-btn>
    </q-form>
    <q-table
      :rows-per-page-options="[1, 3, 10, 15]"
      title="Cписок Клиентов"
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
          <q-input
            filled
            v-model="editUserLogin"
            label="Login"
            class="q-mb-md"
          />

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
  </div>
</template>

<script setup></script>

<style scoped lang="scss">
.buttons {
  column-gap: 20px;
  margin-bottom: 20px;
}
</style>
