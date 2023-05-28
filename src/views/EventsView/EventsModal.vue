<template>
  <q-dialog v-model="modalConfig.status">
    <q-card class="q-pa-md" style="max-width: initial">
      <q-toolbar>
        <q-toolbar-title>{{ modalConfig.name }}</q-toolbar-title>
        <q-btn flat round dense v-close-popup><q-icon class="text-primary" size="1.5em" name="fas fa-xmark" /></q-btn>
      </q-toolbar>
      <q-spinner color="primary" size="3em" :thickness="2" v-if="loading" />
      <q-form autofocus style="min-width: 600px">
        <q-input
          filled
          v-model="eventData.title"
          label="Событие"
          class="q-mb-md"
          dense
          :readonly="
            modalConfig.action === 'reschedule' ||
            modalConfig.action === 'watch' ||
            modalConfig.action === 'closeWithResult' ||
            modalConfig.action === 'closeWithoutResult'
          "
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
          :readonly="
            modalConfig.action === 'reschedule' ||
            modalConfig.action === 'watch' ||
            modalConfig.action === 'closeWithResult' ||
            modalConfig.action === 'closeWithoutResult'
          "
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
          :readonly="
            modalConfig.action === 'reschedule' ||
            modalConfig.action === 'watch' ||
            modalConfig.action === 'closeWithResult' ||
            modalConfig.action === 'closeWithoutResult'
          "
        />

        <DatePicker
          label="Дата"
          v-model="eventData.appointment_date"
          class="q-mb-md"
          :readonly="
            modalConfig.action === 'watch' ||
            modalConfig.action === 'closeWithResult' ||
            modalConfig.action === 'closeWithoutResult'
          "
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

        <q-btn
          label="Подтвердить"
          v-if="modalConfig.action !== 'watch'"
          color="primary"
          @click="submitForm"
          :disabled="!isValidationPassed"
        />
        <q-btn
          label="Завершить с результатом"
          color="secondary"
          class="q-ml-sm"
          v-if="modalConfig.action === 'watch'"
          @click="accomplishHandler(eventData, true)"
        />
        <q-btn
          label="Завершить без результата"
          color="secondary"
          class="q-ml-sm"
          v-if="modalConfig.action === 'watch'"
          @click="accomplishHandler(eventData, false)"
        />
        <q-btn
          label="Запланировать"
          color="secondary"
          class="q-ml-sm"
          v-if="modalConfig.action === 'watch'"
          @click="rescheduleHandler(eventData)"
        />
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useClients } from "./composables/useClients";
import eventService from "@/api/events";
import useEventsModal from "./composables/useEventsModal";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import moment from "moment";
import { useEvents } from "./composables/useEvents";
import { useQuasar } from "quasar";

const $q = useQuasar();
const { accomplishHandler, rescheduleHandler } = useEvents();
const store = useStore();

const { clients, onFilter } = useClients();
const loading = ref(false);
// eslint-disable-next-line no-undef
const emit = defineEmits(["sumbit"]);
const { modalConfig, eventData } = useEventsModal();

const isValidationPassed = computed(() => {
  if (modalConfig.value.action === "closeWithResult") {
    return !!eventData.value.comment;
  }
  return eventData.value.title && eventData.value.type_id && eventData.value.appointment_date;
});

async function submitForm() {
  if (!isValidationPassed.value) {
    return;
  }
  loading.value = true;
  try {
    if (modalConfig.value.action === "add") {
      eventData.value.userId = store.state.user.user.id;
      const newEvent = eventData.value;
      newEvent.client_id = typeof eventData.value.client === "object" ? eventData.value.client.id : eventData.value.client;
      delete newEvent.client;
      try {
        await eventService.create(eventData.value);
        $q.notify({
          type: "positive",
          message: "Событие создано",
        });
      } catch (error) {
        $q.notify({
          type: "negative",
          message: error.message,
        });
      }
    } else if (modalConfig.value.action === "edit") {
      await eventService.update(eventData.value.id, eventData.value);
    } else if (modalConfig.value.action === "closeWithResult") {
      await eventService.accomplish(eventData.value.id, {
        result: true,
        fulfilled_date: moment().format("YYYY-MM-DD"),
        comment: eventData.value.comment,
      });
    } else if (modalConfig.value.action === "closeWithoutResult") {
      await eventService.accomplish(eventData.value.id, {
        result: true,
        fulfilled_date: moment().format("YYYY-MM-DD"),
        comment: eventData.value.comment,
      });
    } else if (modalConfig.value.action === "reschedule") {
      try {
        const { message } = await eventService.reschedule(eventData.value.id, {
          new_appointment_date: eventData.value.appointment_date,
          comment: eventData.value.comment,
        });
        $q.notify({
          type: "positive",
          message: message,
        });
      } catch (error) {
        $q.notify({
          type: "negative",
          message: error.message,
        });
      }
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
