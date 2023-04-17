// eslint-disable-next-line no-unused-vars
export default function useEditClients(modalConfig, userData) {
  function editHandler(user) {
    modalConfig.value.status = true;
    modalConfig.value.action = "edit";
    modalConfig.value.name = "Pедактировать пользователя";
    const norefUser = Object.assign({}, user);
    userData.value = norefUser;
  }

  return { editHandler };
}
