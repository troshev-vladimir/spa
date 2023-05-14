import { computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { useEvents } from "./useEvents";

export default function useEventsInit(tableRef) {
  const store = useStore();
  const department = computed(() => store.state.department);
  const { fetchAllEvents } = useEvents();

  watch(department, async () => {
    tableRef.value.requestServerInteraction();
  });

  onMounted(async () => {
    if (store.state.user.user.departments?.length) await fetchAllEvents();
    store.dispatch("events/fetchTypes");
  });

  return {
    columns,
  };
}

const columns = [
  {
    name: "actions",
    required: true,
    label: "",
    align: "left",
    field: "name",
    format: (val) => `${val}`,
  },
  {
    name: "id",
    required: true,
    label: "№",
    align: "left",
    field: "id",
    format: (val) => `${val}`,
  },
  {
    name: "title",
    required: true,
    label: "Событие",
    align: "left",
    field: "title",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "type",
    required: true,
    label: "Тип",
    align: "left",
    field: "type",
    format: (type) => `${type.title}`,
  },
  {
    name: "client",
    required: true,
    label: "Клиент",
    align: "left",
    field: "client",
    format: (client) => `${client.name}`,
    sortable: true,
  },
  {
    name: "appointment_date",
    required: true,
    label: "Дата",
    align: "left",
    field: "appointment_date",
    format: (val) => `${val}`,
    sortable: true,
  },
  {
    name: "fulfilled_date",
    required: true,
    label: "fulfilled_date",
    align: "left",
    field: "fulfilled_date",
    format: (val) => `${val}`,
    sortable: true,
  },
];
