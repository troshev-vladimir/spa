export default function useFetchClients(modalConfig, userData) {
  function addHandler() {
    modalConfig.value.status = true;
    modalConfig.value.action = "add";
    modalConfig.value.name = "Создать клиента";

    userData.value = {};
  }

  return { addHandler };
}
