import { ref } from "vue";
export default function useEventsModal() {
  const modalConfig = ref(modal);
  return { modalConfig, saleData, adCompany, saleItems };
}

const saleData = ref({
  id: null,
  placement_date: "",
  payed_date: "",
  start: "",
  end: "",
  id_1c: null,
  user: "",
  sale_items: "",
  client_id: "",
  type_id: null,
  smi_id: "",
  title: "",
  summa: "",
  locked: "",
});

const saleItems = ref([{ title: "", summ: 0, amount: 1 }]);
const adCompany = ref({ from: null, to: null });

// Ed: Если не выносить то почему то не работает
const modal = { status: false, action: null, name: "" };
