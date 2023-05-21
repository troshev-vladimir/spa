import { ref } from "vue";
import { useStore } from "vuex";
import eventService from "@/api/events";
import moment from "moment";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";
import useEventsModal from "./useEventsModal";

export function useEvents() {
  const route = useRoute();
  const store = useStore();
  const loadingDepartment = ref(false);
  const $q = useQuasar();
  const { modalConfig, eventData } = useEventsModal();

  async function fetchAllEvents(archive = false) {
    loadingDepartment.value = true;
    try {
      if (archive) {
        await store.dispatch("events/fetchAllArchiveEvents", {
          ...route.query,
        });
      } else {
        await store.dispatch("events/fetchAllEvents", {
          ...route.query,
        });
      }
    } catch (error) {
      $q.notify({
        type: "negative",
        message: error,
      });
    } finally {
      loadingDepartment.value = false;
    }
  }

  async function accomplishHandler(event, resultStatus) {
    const accompleshedEvent = event;
    const norefEvent = Object.assign({}, event);
    // norefUser.division_id = user.division.id;
    eventData.value = norefEvent;
    await getAttendantData();
    if (!resultStatus) {
      accompleshedEvent.fulfilled_date = moment().format("YYYY-MM-DD");
      accompleshedEvent.result = false;
      modalConfig.value.status = true;
      modalConfig.value.action = "closeWithoutResult";
      modalConfig.value.name = "Завершить событие без результата";
      // await eventService.update(event.id, accompleshedEvent);
      // await eventService.moveToArchive(event.id);
    } else {
      modalConfig.value.status = true;
      modalConfig.value.action = "closeWithResult";
      modalConfig.value.name = "Завершить событие с результатом";
    }
  }

  async function rescheduleHandler(event) {
    const norefEvent = Object.assign({}, event);
    eventData.value = norefEvent;
    modalConfig.value.status = true;
    modalConfig.value.action = "reschedule";
    modalConfig.value.name = "Перезапланировать";
  }

  function getAttendantData() {
    store.dispatch("events/fetchTypes");
  }

  async function addHandler(client = {}) {
    loadingDepartment.value = true;
    await getAttendantData();
    modalConfig.value.status = true;
    modalConfig.value.action = "add";
    modalConfig.value.name = "Создать событие";
    eventData.value = { client: client };
    loadingDepartment.value = false;
  }

  async function editHandler(event) {
    loadingDepartment.value = true;
    await getAttendantData();
    modalConfig.value.status = true;
    modalConfig.value.action = "edit";
    modalConfig.value.name = "Pедактировать событие";
    const norefEvent = Object.assign({}, event);
    // norefUser.division_id = user.division.id;
    eventData.value = norefEvent;
    loadingDepartment.value = false;
  }

  async function moveToArchive(event) {
    loadingDepartment.value = true;
    try {
      const data = await eventService.moveToArchive(event.id);

      $q.notify({
        type: "positive",
        message: data.message,
      });
    } catch (error) {
      $q.notify({
        type: "negative",
        message: error,
      });
    }
    fetchAllEvents();
    loadingDepartment.value = false;
  }

  async function watchEvent(event) {
    loadingDepartment.value = true;
    await getAttendantData();
    modalConfig.value.status = true;
    modalConfig.value.action = "watch";
    modalConfig.value.name = "Просмотр событие";
    const norefEvent = Object.assign({}, event);
    // norefUser.division_id = user.division.id;
    eventData.value = norefEvent;
    loadingDepartment.value = false;
  }

  function deleteHandler(userId) {
    eventService.delete(userId);
    fetchAllEvents();
  }

  return {
    addHandler,
    editHandler,
    deleteHandler,
    loadingDepartment,
    fetchAllEvents,
    accomplishHandler,
    watchEvent,
    rescheduleHandler,
    moveToArchive,
  };
}
