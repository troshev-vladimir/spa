import { ref } from "vue";
export default function useEventsModal() {
  const modalConfig = ref(modal);
  return { modalConfig, eventData };
}

const eventData = ref({
  id: null,
  title: "",
  type: "",
  client_id: null,
  date: "",
  fulfilled_date: null,
});

// Ed: Если не выносить то почему то не работает
const modal = { status: false, action: null, name: "" };
