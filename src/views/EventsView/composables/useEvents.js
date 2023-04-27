import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import eventService from "@/api/events";
import moment from "moment";

export function useEvents(modalConfig, eventData, tableRef) {
  const store = useStore();
  const department = computed(() => store.state.department);
  const loadingDepartment = ref(false);

  watch(department, async () => {
    tableRef.value.requestServerInteraction();
  });

  onMounted(async () => {
    if (store.state.department) {
      fetchAllEvents();
      await store.dispatch("events/fetchTypes");
    }
  });

  async function fetchAllEvents() {
    loadingDepartment.value = true;
    await store.dispatch("events/fetchAllEvents");
    loadingDepartment.value = false;
  }

  async function accomplishHandler(event) {
    const accompleshedEvent = event;
    accompleshedEvent.fulfilled_date = moment().format("YYYY-MM-DD");
    eventService.update(event.id, accompleshedEvent);
  }

  function addHandler() {
    modalConfig.value.status = true;
    modalConfig.value.action = "add";
    modalConfig.value.name = "Создать событие";
    eventData.value = {};
  }

  function editHandler(user) {
    modalConfig.value.status = true;
    modalConfig.value.action = "edit";
    modalConfig.value.name = "Pедактировать событие";
    const norefEvent = Object.assign({}, user);
    // norefUser.division_id = user.division.id;
    eventData.value = norefEvent;
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
