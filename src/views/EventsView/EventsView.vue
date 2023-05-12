<template>
  <div class="container">
    <!-- <div class="col"><ClientFilter></ClientFilter></div> -->
    <!-- <div class="col">
        <q-btn size="md" @click="fetchAllClients">Найти</q-btn>
      </div> -->
    <EventsFilter class="q-mb-md" />

    <q-table
      :loading="loadingDepartment"
      title="Cписок Событий"
      :rows="store.state.events.eventsData"
      :columns="columns"
      :rows-per-page-options="[0, 2, 5]"
      row-key="name"
      ref="tableRef"
      v-model:pagination="pagination"
      @request="onRequest"
    >
      <template v-slot:body="row">
        <q-tr @click="showUserModal(row.row)" class="cursor-pointer">
          <template v-for="col in row.cols" :key="col.name">
            <td v-if="col.name === 'actions'">
              <q-btn-dropdown
                color="primary"
                dense
                dropdown-icon="fa-solid fa-ellipsis-vertical"
                no-icon-animation
                flat
                cover
                menu-self="top left"
                auto-close
                @click.stop
              >
                <q-list>
                  <q-item-section style="min-width: 200px">
                    <q-btn @click.stop="editHandler(row.row)">Редактировать</q-btn>
                    <q-btn @click.stop="">В архив (in progress)</q-btn>
                    <q-btn @click.stop="accomplishHandler(row.row)">Завершить</q-btn>
                    <q-btn @click.stop="deleteHandler(row.row.id)"> Удалить </q-btn>
                  </q-item-section>
                </q-list>
              </q-btn-dropdown>
            </td>
            <td v-else-if="col.name === 'roles'">{{ col.value }}</td>
            <td v-else>{{ col.value }}</td>
          </template>
        </q-tr>
      </template>
    </q-table>
    <div class="row">
      <div class="col-12">
        <q-btn class="q-mt-md" @click.stop="addHandler()">
          <q-icon class="text-primary q-mr-md" size="1.3em" name="fas fa-plus" /> Добавить Событие
        </q-btn>
      </div>
    </div>
    <EventsModal @sumbit="fetchAllEvents" />
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import EventsFilter from "@/components/Events/EventsFilter";
import { useEvents } from "./composables/useEvents";
import usePagination from "./composables/usePagination";
import { ref } from "vue";
import EventsModal from "./EventsModal.vue";

const tableRef = ref(null);
const loading = ref(false);
const store = useStore();

const { editHandler, addHandler, deleteHandler, loadingDepartment, fetchAllEvents, accomplishHandler } = useEvents(tableRef);

const { onRequest, pagination } = usePagination(store.dispatch.bind(this, "events/fetchAllEvents"), loading);

const columns = [
  {
    name: "actions",
    required: true,
    label: "",
    align: "left",
    field: "name",
    format: (val) => `${val}`,
  },
  {
    name: "id",
    required: true,
    label: "№",
    align: "left",
    field: "id",
    format: (val) => `${val}`,
  },
  {
    name: "title",
    required: true,
    label: "Событие",
    align: "left",
    field: "title",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "type",
    required: true,
    label: "Тип",
    align: "left",
    field: "type",
    format: (type) => `${type.title}`,
  },
  {
    name: "client",
    required: true,
    label: "Клиент",
    align: "left",
    field: "client",
    format: (client) => `${client.name}`,
    sortable: true,
  },
  {
    name: "appointment_date",
    required: true,
    label: "Дата",
    align: "left",
    field: "appointment_date",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "fulfilled_date",
    required: true,
    label: "fulfilled_date",
    align: "left",
    field: "fulfilled_date",
    format: (val) => `${val}`,
    sortable: true,
  },
];
</script>
