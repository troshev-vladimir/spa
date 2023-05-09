<template>
  <q-dialog v-model="modalConfig.status">
    <q-card class="q-pa-md">
      <q-toolbar>
        <q-toolbar-title>{{ modalConfig.name }}</q-toolbar-title>

        <q-btn flat round dense v-close-popup>&times;</q-btn>
      </q-toolbar>
      <q-spinner color="primary" size="3em" :thickness="2" v-if="loading" />
      <q-form autofocus style="min-width: 400px">
        <q-input filled v-model="eventData.title" label="Событие" class="q-mb-md" dense />

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
        />

        <DatePicker v-model="eventData.appointment_date" class="q-mb-md" />

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
      await eventService.create(eventData.value);
    } else if (modalConfig.value.action === "edit") {
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
