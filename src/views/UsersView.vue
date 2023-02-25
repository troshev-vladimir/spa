<template>
  <section>
    <TableFilter v-model:filter="filterValue" />
    <q-table
      title="Cписок пользователей"
      :rows="rows"
      :columns="columns"
      row-key="name"
    >
      <template v-slot:body="row">
        <q-tr @click="showUserModal(row.row)" class="cursor-pointer">
          <template v-for="col in row.cols" :key="col.name">
            <td v-if="col.name === 'status'">
              <q-toggle v-model="row.row.status"></q-toggle>
            </td>
            <td v-else>{{ col.value }}</td>
          </template>
        </q-tr>
      </template>
    </q-table>
  </section>
</template>

<script setup>
import TableFilter from "@/components/TableFilter.vue";

import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { watch, ref } from "vue";

const store = useStore();
const users = store.state.users.usersData;
const route = useRoute();
let rows = ref(users);
const $q = useQuasar();

const colsTitlesTranslate = {
  id: "Идентификатор",
  name: "ФИО",
  phone: "Телефон",
  balance: "Баланс",
  status: "Статус",
};

function fieldHandler(row, name) {
  switch (name) {
    case "id":
      return row[name] + 1;

    default:
      return row[name];
  }
}

function showUserModal(data) {
  const elements = Object.entries(data);

  let templateHtml = "";

  for (const row of elements) {
    templateHtml += `<div style="border-bottom: 1px dashed #666;" class="row justify-between q-mb-md">
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

// eslint-disable-next-line no-unused-vars
const { password, ...fields } = users[0];
const columns = Object.keys(fields).map((colName) => {
  return {
    name: colName,
    required: true,
    label: colsTitlesTranslate[colName],
    align: "left",
    field: (row) => fieldHandler(row, colName),
    format: (val) => `${val}`,
    sortable: true,
  };
});

const params = route.query;
const filterValue = ref(params);
watch(filterValue, ({ name, phone }) => {
  rows.value = users.filter((user) => {
    return (
      (name ? user.name.indexOf(name) + 1 : true) &&
      (phone ? user.phone.indexOf(phone) + 1 : true)
    );
  });
});
</script>
