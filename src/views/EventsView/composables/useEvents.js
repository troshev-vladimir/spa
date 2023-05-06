import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import eventService from "@/api/events";
import moment from "moment";
import { useRoute } from "vue-router";
import { useQuasar } from "quasar";

export function useEvents(modalConfig, eventData, tableRef) {
  const route = useRoute();
  const store = useStore();
  const department = computed(() => store.state.department);
  const loadingDepartment = ref(false);
  const $q = useQuasar();

  watch(department, async () => {
    tableRef.value.requestServerInteraction();
  });

  onMounted(async () => {
    if (store.state.department) {
      fetchAllEvents();
      store.dispatch("events/fetchTypes");
    }
  });

  async function fetchAllEvents() {
    loadingDepartment.value = true;
    try {
      await store.dispatch("events/fetchAllEvents", {
        ...route.query,
      });
    } catch (error) {
      $q.notify({
        type: "positive",
        message: error,
      });
    }

    loadingDepartment.value = false;
  }

  async function accomplishHandler(event) {
    const accompleshedEvent = event;
    accompleshedEvent.fulfilled_date = moment().format("YYYY-MM-DD");
    eventService.update(event.id, accompleshedEvent);
  }

  function getAttendantData() {
    store.dispatch("events/fetchTypes");
  }

  async function addHandler() {
    loadingDepartment.value = true;
    await getAttendantData();
    modalConfig.value.status = true;
    modalConfig.value.action = "add";
    modalConfig.value.name = "Создать событие";
    eventData.value = {};
    loadingDepartment.value = false;
  }

  async function editHandler(user) {
    loadingDepartment.value = true;
    await getAttendantData();
    modalConfig.value.status = true;
    modalConfig.value.action = "edit";
    modalConfig.value.name = "Pедактировать событие";
    const norefEvent = Object.assign({}, user);
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
    department,
    loadingDepartment,
    fetchAllEvents,
    accomplishHandler,
  };
}
