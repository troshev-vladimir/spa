import { ref } from "vue";
import { useStore } from "vuex";
import clientService from "@/api/clients";

export function useClients() {
  const store = useStore();
  const clients = ref(store.state.clients.clientsData);
  const query = ref(null);
  const selected = ref(null);

  async function onFilter(val, update) {
    query.value = val;
    const result = await clientService.getAll(store.state.department.id, {
      page: 1,
      perPage: 20,
      name: val,
    });

    clients.value = result.data;
    update();
  }

  return {
    onFilter,
    selected,
    clients,
  };
}
