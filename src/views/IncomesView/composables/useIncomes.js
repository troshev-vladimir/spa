import { onMounted, ref } from "vue";
import { useStore } from "vuex";

export function useIncomes(params) {
  const store = useStore();
  const loadingDepartment = ref(false);

  onMounted(async () => {
    if (store.state.department) {
      fetchAllIncomes();
    }
  });

  async function fetchAllIncomes() {
    loadingDepartment.value = true;
    await store.dispatch("incomes/fetchAllIncomes", params);
    loadingDepartment.value = false;
  }

  return {
    loadingDepartment,
    fetchAllIncomes,
  };
}
