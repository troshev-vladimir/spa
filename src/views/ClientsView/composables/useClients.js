import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import clientService from "@/api/clients";
import { useQuasar } from "quasar";

export function useClients(modalConfig, userData, tableRef) {
  const store = useStore();
  const department = computed(() => store.state.department);
  const loadingDepartment = ref(false);
  const $q = useQuasar();

  watch(department, async () => {
    tableRef.value.requestServerInteraction();
  });

  onMounted(async () => {
    if (store.user.user.departments.length) {
      fetchAllClients();
    } else {
      $q.notify({
        type: "negative",
        message: "Вам не назначен ни один Департамент",
      });
    }
  });

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

    userData.value = {};
  }

  function editHandler(user) {
    modalConfig.value.status = true;
    modalConfig.value.action = "edit";
    modalConfig.value.name = "Pедактировать пользователя";
    const norefUser = Object.assign({}, user);
    norefUser.division_id = user.division.id;
    userData.value = norefUser;
  }

  function deleteHandler(userId) {
    clientService.delete(userId);
    fetchAllClients();
  }

  return {
    addHandler,
    editHandler,
    deleteHandler,
    department,
    loadingDepartment,
    fetchAllClients,
  };
}
