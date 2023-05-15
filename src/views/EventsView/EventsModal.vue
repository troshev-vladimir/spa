<template>
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
          :readonly="modalConfig.action === 'watch' || modalConfig.action === 'closeWithResult'"
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
          :readonly="modalConfig.action === 'watch' || modalConfig.action === 'closeWithResult'"
        />

        <q-select
          v-model="eventData.client"
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
          class="q-mb-md"
          clearable
          options-dense
          :readonly="modalConfig.action === 'watch' || modalConfig.action === 'closeWithResult'"
        />

        <DatePicker
          label="Дата"
          v-model="eventData.appointment_date"
          class="q-mb-md"
          :readonly="modalConfig.action === 'watch' || modalConfig.action === 'closeWithResult'"
        />

        <q-input
          v-if="modalConfig.action !== 'add'"
          filled
          v-model="eventData.comment"
          label="Коммент"
          class="q-mb-md"
          type="textarea"
          dense
          :readonly="modalConfig.action === 'watch'"
          :autofocus="modalConfig.action === 'closeWithResult'"
        />

        <q-btn label="Submit" color="primary" @click="submitForm" />
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" dense />
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useClients } from "./composables/useClients";
import eventService from "@/api/events";
import useEventsModal from "./composables/useEventsModal";
import { ref } from "vue";
import { useStore } from "vuex";
import moment from "moment";

const store = useStore();

const { clients, onFilter } = useClients();
const loading = ref(false);
// eslint-disable-next-line no-undef
const emit = defineEmits(["sumbit"]);
const { modalConfig, eventData } = useEventsModal();

async function submitForm() {
  loading.value = true;
  try {
    if (modalConfig.value.action === "add") {
      eventData.value.userId = store.state.user.user.id;
      const newEvent = eventData.value;
      newEvent.client_id = eventData.value.client;
      delete newEvent.client;
      await eventService.create(eventData.value);
    } else if (modalConfig.value.action === "edit") {
      await eventService.update(eventData.value.id, eventData.value);
    } else if (modalConfig.value.action === "closeWithResult") {
      eventData.value.fulfilled_date = moment().format("YYYY-MM-DD");
      eventData.value.result = false;
      await eventService.update(eventData.value.id, eventData.value);
      await eventService.moveToArchive(eventData.value.id);
    } else if (modalConfig.value.action === "reschedule") {
      eventData.value.comment = eventData.value.comment + "Перенос события:" + eventData.value.appointment_date;
      await eventService.update(eventData.value.id, eventData.value);
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
