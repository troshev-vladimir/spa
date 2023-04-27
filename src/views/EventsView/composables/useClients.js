import { ref, watch } from "vue";
import { useStore } from "vuex";

export function useClients() {
  const store = useStore();
  const clients = ref(store.state.clients.clientsData);
  const query = ref(null);
  const selected = ref(null);

  function onFilter(val, update) {
    query.value = val;
    update();
  }

  watch(query, () => {});

  return {
    onFilter,
    selected,
    clients,
  };
}
