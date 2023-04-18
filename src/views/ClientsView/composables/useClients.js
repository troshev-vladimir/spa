import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";
import clientService from "@/api/clients";

export function useClients(modalConfig, userData) {
  const store = useStore();
  const department = computed(() => store.state.department);
  const loadingDepartment = ref(false);

  watch(department, async () => {
    loadingDepartment.value = true;
    await store.dispatch("clients/fetchAllClientsByDepartment");
    loadingDepartment.value = false;
  });

  onMounted(async () => {
    if (store.state.department) {
      loadDepartmentClient();
    }
  });

  async function loadDepartmentClient() {
    loadingDepartment.value = true;
    await store.dispatch("clients/fetchAllClientsByDepartment");
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
    userData.value = norefUser;
  }

  function deleteHandler(userId) {
    clientService.delete(userId);
    loadDepartmentClient();
  }

  return {
    addHandler,
    editHandler,
    deleteHandler,
    department,
    loadingDepartment,
    loadDepartmentClient,
  };
}
