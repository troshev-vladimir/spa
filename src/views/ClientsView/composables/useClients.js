import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import clientService from "@/api/clients";
import eventService from "@/api/events";
import { useQuasar } from "quasar";
// import useEventsModal from "@/views/EventsView/composables/useEventsModal";
import { useEvents } from "@/views/EventsView/composables/useEvents";
import { useSales } from "@/views/SalesView/composables/useSales";

export function useClients(modalConfig, tableRef) {
  const { addHandler: eventsAddHendler, watchEvent } = useEvents();
  const { addHandler: salesAddHendler } = useSales();
  const store = useStore();
  const department = computed(() => store.state.department);
  const loadingDepartment = ref(false);
  const $q = useQuasar();

  watch(department, async () => {
    await tableRef.value.requestServerInteraction();
  });

  onMounted(async () => {
    if (store.state.user.user.departments?.length) fetchAllClients();

    if (!store.state.clients.metadata.jobs.length) {
      store.dispatch("clients/fetchMetadata");
    }
  });

  function createEventForClient(client) {
    eventsAddHendler(client);
  }

  function createSaleForClient(client) {
    salesAddHendler(client);
  }

  async function showEvent(client) {
    try {
      const event = await eventService.getOneByClientId(client.id);
      if (event.length > 1) {
        $q.notify({
          type: "negative",
          message: "На клиенте болшее одного события",
        });
      } else if (!event.length) {
        $q.notify({
          type: "negative",
          message: "У этого клиента нет события",
        });
        return;
      }
      watchEvent(event[0]);
    } catch (error) {
      $q.notify({
        type: "negative",
        message: error,
      });
    }
  }

  async function fetchAllClients() {
    loadingDepartment.value = true;
    try {
      await store.dispatch("clients/fetchAllClients");
    } catch (error) {
      $q.notify({
        type: "negative",
        message: error,
      });
    }
    loadingDepartment.value = false;
  }

  function addHandler() {
    modalConfig.value.status = true;
    modalConfig.value.action = "add";
    modalConfig.value.name = "Создать клиента";

    userData.value = initialState;
  }

  function editHandler(user) {
    modalConfig.value.status = true;
    modalConfig.value.action = "edit";
    modalConfig.value.name = "Pедактировать пользователя";
    const norefUser = Object.assign({}, user);
    norefUser.division_id = user.division.id;
    norefUser.legals = norefUser.legals ? norefUser.legals : {};
    userData.value = norefUser;
  }

  function deleteHandler(userId) {
    clientService.delete(userId);
    fetchAllClients();
  }

  return {
    userData,
    addHandler,
    editHandler,
    deleteHandler,
    department,
    loadingDepartment,
    fetchAllClients,
    createEventForClient,
    createSaleForClient,
    showEvent,
  };
}

const initialState = {
  id: null,
  email: null,
  name: null,
  phone: null,
  phone_add: null,
  site: null,
  vk: null,
  birth_day: "",
  // 'created_at' =>$this->created_at->format('Y.m.d'),
  department: null,
  division: null,
  creator: null,
  comment: null,
  address: null,
  address_add: null,
  user_id: null,
  // activity_id: null,
  //Это статусы Клиента
  active: true,
  federal: false,
  top: false,
  prioritet: false,

  activity: null,
  potencial: null,
  contacts: [],
  legals: {},
};

const userData = ref(initialState);
