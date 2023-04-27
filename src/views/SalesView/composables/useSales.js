import { onMounted, ref } from "vue";
import { useStore } from "vuex";
import salesService from "@/api/sales";

export function useSales(modalConfig, saleData) {
  const store = useStore();
  const loadingDepartment = ref(false);

  onMounted(async () => {
    if (store.state.department) {
      fetchAllSales();
      await store.dispatch("sales/fetchAllTypes");
      await store.dispatch("sales/fetchAllSmi");
    }
  });

  async function fetchAllSales() {
    loadingDepartment.value = true;
    await store.dispatch("sales/fetchAllSales");
    loadingDepartment.value = false;
  }

  function addHandler() {
    modalConfig.value.status = true;
    modalConfig.value.action = "add";
    modalConfig.value.name = "Создать продажу";

    saleData.value = {};
  }

  function editHandler(sale) {
    modalConfig.value.status = true;
    modalConfig.value.action = "edit";
    modalConfig.value.name = "Pедактировать продажу";
    const norefSale = Object.assign({}, sale);
    // norefSale.division_id = sale.division.id;
    saleData.value = norefSale;
  }

  function deleteHandler(userId) {
    salesService.delete(userId);
    fetchAllSales();
  }

  return {
    addHandler,
    editHandler,
    deleteHandler,
    loadingDepartment,
    fetchAllSales,
  };
}
