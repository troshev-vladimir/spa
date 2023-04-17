import { computed, onMounted, ref, watch } from "vue";
import { useStore } from "vuex";

export default function useFetchClients() {
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
      loadingDepartment.value = true;
      await store.dispatch("clients/fetchAllClientsByDepartment");
      loadingDepartment.value = false;
    }
  });

  return { department, loadingDepartment };
}
