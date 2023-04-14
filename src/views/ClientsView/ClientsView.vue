<template>
  <div class="container">
    <q-table
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
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useStore } from "vuex";
const store = useStore();

onMounted(() => {
  store.dispatch("clients/fetchAllClientsByDepartment");
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
    name: "name",
    required: true,
    label: "Логин",
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
