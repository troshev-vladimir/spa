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
            <q-btn @click.stop="">Удалить</q-btn>
          </td>
          <td v-else>{{ col.value }}</td>
        </template>
      </q-tr>
    </template>
  </q-table>
</template>

<script setup>
import { useStore } from "vuex";
// import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { onMounted } from "vue";

const store = useStore();
const $q = useQuasar();

onMounted(() => {
  store.dispatch("users/fetchAllUsers");
});

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
