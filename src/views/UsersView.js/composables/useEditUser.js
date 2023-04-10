import { ref } from "vue";
import rolesService from "@/api/roles";
import usersService from "@/api/users";

export default function (allRoles) {
  let userId = null;
  const editModalStatus = ref(false);
  const editUserLoading = ref(false);
  const editUserLogin = ref("");
  const editUserRoles = ref("");
  const roleModal = ref("");

  async function getUser() {
    editUserLoading.value = true;

    try {
      const oldUser = await usersService.getOne(userId);
      editUserLogin.value = oldUser.login;
      editUserRoles.value = oldUser.roles;
    } catch (error) {
      console.log(error);
    }
    editUserLoading.value = false;
  }

  async function editHandler(user) {
    editModalStatus.value = true;
    userId = user.id;
    getUser();
  }

  async function addRole() {
    await rolesService.attachRole(roleModal.value.id, userId);
    await getUser();
  }

  async function removeRole() {
    await rolesService.detachRole(roleModal.value.id, userId);
    await getUser();
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
    editUserLoading,
  };
}
