import { ref } from "vue";
import rolesService from "@/api/roles";
import usersService from "@/api/users";

export default function (allRoles) {
  let userId = null;
  const editModalStatus = ref(false);
  const editUserLogin = ref("");
  const editUserRoles = ref("");
  const roleModal = ref("");

  async function editHandler(user) {
    editModalStatus.value = true;
    const oldUser = await usersService.getOne(user.id);
    editUserLogin.value = oldUser.login;
    editUserRoles.value = oldUser.roles;
    userId = user.id;
  }

  async function addRole() {
    await rolesService.attachRole(roleModal.value.id, userId);
    editModalStatus.value = false;
  }

  async function removeRole() {
    await rolesService.detachRole(roleModal.value.id, userId);
    editModalStatus.value = false;
  }

  async function submitForm() {
    try {
      await usersService.update(userId, {
        login: editUserLogin.value,
      });
    } catch (error) {
      console.log(error);
    } finally {
      editModalStatus.value = false;
    }
  }

  return {
    editUserRoles,
    editUserLogin,
    editModalStatus,
    roleModal,
    editHandler,
    addRole,
    removeRole,
    allRoles,
    submitForm,
  };
}
