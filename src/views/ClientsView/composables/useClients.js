import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import clientService from "@/api/clients";

export function useClients(modalConfig, userData) {
  const store = useStore();
  const department = computed(() => store.state.department);
  const loadingDepartment = ref(false);

  watch(department, async () => {
    loadingDepartment.value = true;
    await store.dispatch("clients/fetchAllClients");
    loadingDepartment.value = false;
  });

  onMounted(async () => {
    if (store.state.department) {
      fetchAllClients();
    }
  });

  async function fetchAllClients() {
    loadingDepartment.value = true;
    await store.dispatch("clients/fetchAllClients");
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
