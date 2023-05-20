import { ref } from "vue";
import { useStore } from "vuex";
import salesService from "@/api/sales";
import useSalesModal from "./useSalesModal";

export function useSales() {
  const store = useStore();
  const loadingDepartment = ref(false);

  const { saleData, modalConfig, saleItems, adCompany } = useSalesModal();

  async function fetchAllSales() {
    loadingDepartment.value = true;
    await store.dispatch("sales/fetchAllSales");
    loadingDepartment.value = false;
  }

  function getAttendantData() {
    store.dispatch("sales/fetchAllTypes");
    store.dispatch("sales/fetchAllSmi");
  }

  function addHandler(client = "") {
    getAttendantData();
    modalConfig.value.status = true;
    modalConfig.value.action = "add";
    modalConfig.value.name = "Создать продажу";
    adCompany.value = { from: null, to: null };
    saleData.value = {};
    saleData.value.client_id = client.id;
    saleItems.value = [];
  }

  function editHandler(sale) {
    getAttendantData();
    modalConfig.value.status = true;
    modalConfig.value.action = "edit";
    modalConfig.value.name = "Pедактировать продажу";
    const norefSale = Object.assign({}, sale);
    const { type, smi, client, ...payloadSale } = norefSale;
    saleData.value = payloadSale;
    saleData.value.type_id = type.id;
    saleData.value.smi_id = smi.id;
    saleData.value.client_id = client;
    adCompany.value = { from: saleData.value.start, to: saleData.value.end };
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
    saleItems,
    adCompany,
  };
}
