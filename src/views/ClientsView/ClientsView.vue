<template>
  <div class="container">
    <div class="row items-start q-mb-md">
      <div class="col-12">
        <ClientFilter></ClientFilter>
      </div>
    </div>

    <q-table
      :loading="loadingDepartment"
      title="Cписок Клиентов"
      :rows="store.state.clients.clientsData"
      :columns="columns"
      v-model:pagination="pagination"
      :rows-per-page-options="[0, 2, 5]"
      row-key="name"
      @request="onRequest"
      ref="tableRef"
    >
      <template v-slot:body="row">
        <q-tr class="cursor-pointer">
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
                    <q-btn style="width: 100%" @click.stop="createSaleForClient(row.row)">Создать продажу</q-btn>
                    <q-btn style="width: 100%" @click.stop="createEventForClient(row.row)">Создать событие</q-btn>
                    <q-btn style="width: 100%" @click.stop="showEvent(row.row)">Показать событие</q-btn>
                    <q-btn style="width: 100%" @click.stop="editHandler(row.row)">Редактировать</q-btn>
                    <q-btn style="width: 100%" class="q-mr-md" @click.stop="deleteHandler(row.row.id)"> Удалить </q-btn>
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
    <q-dialog v-model="modalConfig.status">
      <q-card class="q-pa-md" style="min-width: 600px">
        <q-toolbar>
          <q-toolbar-title>{{ modalConfig.name }}</q-toolbar-title>
          <q-btn flat round dense v-close-popup><q-icon class="text-primary" size="1.5em" name="fas fa-xmark" /></q-btn>
        </q-toolbar>
        <q-spinner color="primary" size="3em" :thickness="2" v-if="loading" />
        <q-form autofocus style="min-width: 400px" @submit="submitForm" :key="updateFormKey">
          <q-input
            filled
            v-model="userData.name"
            label="Имя"
            class="q-mb-md"
            dense
            lazy-rules
            :rules="[(val) => !!val || 'Поле обязательное']"
          />
          <div class="q-mb-md">
            <q-checkbox v-model="userData.active" label="active" />
            <q-checkbox v-model="userData.federal" label="federal" />
            <q-checkbox v-model="userData.top" label="top" />
            <q-checkbox v-model="userData.prioritet" label="prioritet" />
          </div>
          <q-input filled v-model="userData.address" label="Адресс" dense class="q-mb-md" />
          <q-input filled v-model="userData.address_add" label="Дополнительный Адресс" dense class="q-mb-md" />
          <q-input
            filled
            v-model="userData.email"
            label="Email"
            lazy-rules
            :rules="[(val, rules) => (val ? rules.email(val) : true) || 'Введите корректный Email']"
            dense
          />

          <q-input
            filled
            v-model="userData.phone"
            label="Телефон"
            unmasked-value
            lazy-rules
            :rules="[(val) => (val ? val.length === 10 : true || 'Введите корректный телефон')]"
            mask="+7 (###) ### ##-##"
            dense
          />
          <q-input
            filled
            v-model="userData.phone_add"
            unmasked-value
            lazy-rules
            :rules="[(val) => (val ? val.length === 10 : true || 'Введите корректный телефон')]"
            label="Дополнительный телефон"
            mask="+7 (###) ### ##-##"
            dense
          />
          <q-input filled v-model="userData.site" label="Сайт" class="q-mb-md" dense />
          <q-input filled v-model="userData.vk" label="Вконтакте" class="q-mb-md" dense />

          <q-select
            v-model="userData.potencial_id"
            :options="store.state.clients.metadata.potentials"
            label="Потенциал"
            map-options
            emit-value
            option-value="id"
            option-label="title"
            dense
            filled
            lazy-rules
            class="q-mb-md"
          />

          <q-select
            v-model="userData.activity_id"
            :options="store.state.clients.metadata.activitys"
            label="Деятельность"
            map-options
            emit-value
            option-value="id"
            option-label="title"
            dense
            filled
            class="q-mb-md"
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
            :rules="[(val) => val || 'Поле обязательно']"
          />

          <DatePicker label="Дата рождения" v-model="userData.birth_day" class="q-mb-md" />

          <q-input v-model="userData.comment" label="Комментарий" type="textarea" class="q-mb-md" filled dense />
          <ClientsContacts class="q-mb-md"></ClientsContacts>

          <div class="q-mb-md">
            <template v-for="(legal, idx) in userData.legals" :key="idx">
              <DadataSuggestions v-model="userData.legals[idx]" @remove="onRemove(legal)"></DadataSuggestions>
            </template>

            <q-btn class="q-mt-md" @click="addLegalHandler()" color="primary">
              <q-icon class="q-mr-md" size="1.3em" name="fas fa-plus" /> Добавить юр. лицо
            </q-btn>
          </div>

          <q-btn
            :label="modalConfig.action === 'add' ? 'Добавить клиента' : 'Изменить клиента'"
            size="lg"
            color="secondary"
            type="submit"
          />
        </q-form>
      </q-card>
    </q-dialog>
    <EventsModal />
    <SalesModal />
    <div class="row">
      <div class="col-12">
        <q-btn class="q-mt-md" @click.stop="addHandler()">
          <q-icon class="text-primary q-mr-md" size="1.3em" name="fas fa-plus" />
          Добавить клиента
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { useClients } from "./composables/useClients";
import useDadata from "./composables/useDadata";

import clientService from "@/api/clients";
import ClientFilter from "@/components/Clients/ClientsFilter.vue";
import DadataSuggestions from "./DadataSuggestions.vue";
import ClientsContacts from "./ClientsContacts.vue";
import EventsModal from "@/views/EventsView/EventsModal.vue";
import SalesModal from "@/views/SalesView/SalesModal.vue";
import { useQuasar } from "quasar";
import { ref, watch, computed } from "vue";
// import _ from "lodash";
import usePagination from "../EventsView/composables/usePagination";

const tableRef = ref(null);
const loading = ref(false);
const store = useStore();
const modalConfig = ref({ status: false, action: null, name: "" });
const $q = useQuasar();
const updateFormKey = ref(0);

function onRemove(legal) {
  removeLegalHandler(legal);
  updateFormKey.value += 1;
}

const {
  editHandler,
  addHandler,
  deleteHandler,
  loadingDepartment,
  fetchAllClients,
  userData,
  createEventForClient,
  createSaleForClient,
  showEvent,
} = useClients(modalConfig);

const department = computed(() => store.state.department);
watch(department, async () => {
  loadingDepartment.value = true;
  await tableRef.value.requestServerInteraction();
  loadingDepartment.value = false;
});

const { addLegalHandler, removeLegalHandler } = useDadata(userData);

const { onRequest, pagination } = usePagination(store.dispatch.bind(this, "clients/fetchAllClients"), loadingDepartment);

async function submitForm() {
  loading.value = true;
  let data = null;
  try {
    if (modalConfig.value.action === "add") {
      userData.value.userId = store.state.user.user.id; // ответственный
      userData.value.creator = store.state.user.user.id; // создатель
      data = await clientService.create(userData.value);
    } else if (modalConfig.value.action === "edit") {
      data = await clientService.update(userData.value.id, userData.value);
    }
    $q.notify({
      type: "positive",
      message: data.message || "",
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      message: error.message,
    });
  } finally {
    modalConfig.value.status = false;
    loading.value = false;
    fetchAllClients();
  }
}

const columns = [
  {
    name: "actions",
    label: "",
    align: "left",
    format: (val) => `${val}`,
    style: "width: 20px;",
  },
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
];
</script>
