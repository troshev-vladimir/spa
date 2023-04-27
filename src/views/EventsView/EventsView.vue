<template>
  <div class="container">
    <div class="row">
      <div class="col-12">
        <q-btn class="q-mb-md" @click.stop="addHandler()">
          Добавить Событие
        </q-btn>
      </div>
    </div>
    <div class="row items-start">
      <div class="col"><ClientFilter></ClientFilter></div>
      <div class="col">
        <q-btn size="md" @click="fetchAllClients">Найти</q-btn>
      </div>
    </div>

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
              <q-btn @click.stop="editHandler(row.row)">Редактировать</q-btn>
              <q-btn @click.stop="">В архив</q-btn>
              <q-btn @click.stop="accomplishHandler(row.row)">Завершить</q-btn>

              <q-btn class="q-mr-md" @click.stop="deleteHandler(row.row.id)">
                Удалить
              </q-btn>
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
            v-model="eventData.title"
            label="Событие"
            class="q-mb-md"
            dense
          />

          <q-select
            v-model="eventData.type_id"
            :options="store.state.events?.eventTypes"
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
            v-model="eventData.client_id"
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
            input-debounce="0"
            class="q-mb-xs"
            clearable
            options-dense
          />

          <q-input filled dense v-model="eventData.appointment_date">
            <template v-slot:append>
              <q-icon name="edit" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
                  <q-date
                    v-model="eventData.appointment_date"
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
import { useEvents } from "./composables/useEvents";
import { useClients } from "./composables/useClients";
import usePagination from "./composables/usePagination";
import eventService from "@/api/events";
import ClientFilter from "@/components/Clients/ClientsFilter.vue";
import { ref } from "vue";
// import _ from "lodash";

const tableRef = ref(null);
const loading = ref(false);
const store = useStore();

const modalConfig = ref({ status: false, action: null, name: "" });
const eventData = ref({
  id: null,
  title: "",
  type: "",
  client_id: null,
  date: "",
  fulfilled_date: null,
});

const { clients, onFilter } = useClients();

const {
  editHandler,
  addHandler,
  deleteHandler,
  loadingDepartment,
  fetchAllEvents,
  accomplishHandler,
} = useEvents(modalConfig, eventData, tableRef);

const { onRequest, pagination } = usePagination(
  store.dispatch.bind(this, "events/fetchAllEvents")
);
async function submitForm() {
  loading.value = true;
  try {
    if (modalConfig.value.action === "add") {
      eventData.value.userId = store.state.user.user.id;
      await eventService.create(eventData.value);
    } else if (modalConfig.value.action === "edit") {
      await eventService.update(eventData.value.id, eventData.value);
    }
  } catch (error) {
    console.log(error);
  } finally {
    modalConfig.value.status = false;
    loading.value = false;
    fetchAllEvents();
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
