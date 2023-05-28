<template>
  <q-dialog v-model="modalConfig.status">
    <q-card class="q-pa-md" style="width: 1200px">
      <q-toolbar>
        <q-toolbar-title>{{ modalConfig.name }}</q-toolbar-title>
        <q-btn flat round dense v-close-popup><q-icon class="text-primary" size="1.5em" name="fas fa-xmark" /></q-btn>
      </q-toolbar>
      <q-spinner color="primary" size="3em" :thickness="2" v-if="loading" />
      <q-form autofocus style="min-width: 400px">
        <q-input filled v-model="saleData.title" label="Название" dense class="q-mb-md" />
        <q-select
          v-model="saleData.client_id"
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
          input-debounce="1000"
          class="q-mb-md"
          clearable
          options-dense
        />

        <q-select
          v-model="saleData.type_id"
          :options="store.state.sales.salesTypes"
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
          v-model="saleData.smi_id"
          :options="store.state.sales.salesSmi"
          label="СМИ"
          map-options
          emit-value
          option-value="id"
          option-label="title"
          dense
          filled
          class="q-mb-md"
        />
        <div class="q-pa-md q-mb-md">
          <p class="text-bold">Услуги</p>
          <ItemsRedactor v-model:items="saleItems" :item="{ title: '', summ: null }" />
        </div>
        <DatePicker v-model="saleData.payedDate" filled dense class="q-mb-md" label="Дата оплаты" />
        <DatePicker v-model="saleData.placementDate" filled dense class="q-mb-md" label="Дата размеещения" />

        <div class="q-mb-md">
          <p>Даты рекламной компании:</p>
          <div>
            <q-badge v-if="adCompany.from" class="q-mr-xs">{{ adCompany.from }}</q-badge>
            <q-badge v-if="adCompany.to">{{ adCompany.to }}</q-badge>
          </div>
          <q-date v-model="adCompany" range mask="YYYY-MM-DD">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </div>

        <q-btn label="Подтвердить" size="lg" color="primary" @click="submitForm" />
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import ItemsRedactor from "@/components/ItemsRedactor";
import { ref } from "vue";
import { useClients } from "../EventsView/composables/useClients";
import useSalesModal from "./composables/useSalesModal";
import salesService from "@/api/sales";
import { useStore } from "vuex";

// eslint-disable-next-line no-undef
const emit = defineEmits(["sumbit"]);

const store = useStore();
const { clients, onFilter } = useClients();
const { modalConfig, saleData, adCompany, saleItems } = useSalesModal();
const loading = ref(false);
async function submitForm() {
  loading.value = true;
  try {
    if (modalConfig.value.action === "add") {
      const { client_id, ...payload } = saleData.value;
      payload.start = adCompany.value.from;
      payload.end = adCompany.value.to;
      payload.client_id = typeof client === "object" ? client_id.id : client_id;
      payload.user_id = store.state.user.user.id;
      payload.id_1c = 1; // TODO откуда взять 1c id
      payload.saleItems = saleItems.value;
      await salesService.create(payload);
    } else if (modalConfig.value.action === "edit") {
      const { id, user, client_id, ...payload } = saleData.value;
      payload.start = adCompany.value.from;
      payload.end = adCompany.value.to;
      payload.client_id = typeof client_id === "object" ? client_id.id : client_id;
      payload.user_id = user.id;
      payload.saleItems = saleItems.value;
      await salesService.update(id, payload);
    }
  } catch (error) {
    console.log(error);
  } finally {
    modalConfig.value.status = false;
    loading.value = false;
    emit("sumbit");
  }
}
</script>

<style></style>
