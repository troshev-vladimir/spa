import { onMounted, ref, watch, computed } from "vue";
import { useStore } from "vuex";
import salesService from "@/api/sales";

export function useSales(modalConfig, saleData, saleItems, tableRef) {
  const store = useStore();
  const loadingDepartment = ref(false);
  const department = computed(() => store.state.department);

  onMounted(async () => {
    if (store.state.department) {
      fetchAllSales();
      await store.dispatch("sales/fetchAllTypes");
      await store.dispatch("sales/fetchAllSmi");
    }
  });

  watch(department, async () => {
    tableRef.value.requestServerInteraction();
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
    saleItems.value = [];
  }

  function editHandler(sale) {
    modalConfig.value.status = true;
    modalConfig.value.action = "edit";
    modalConfig.value.name = "Pедактировать продажу";
    const norefSale = Object.assign({}, sale);
    // norefSale.division_id = sale.division.id;
    saleData.value = norefSale;
    saleItems.value = JSON.parse(saleData.value.saleItems);
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
