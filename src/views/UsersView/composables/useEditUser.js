import { ref } from "vue";
import rolesService from "@/api/roles";
import usersService from "@/api/users";
import departmentsService from "@/api/departments";
import { useQuasar } from "quasar";

export default function () {
  let userId = null;
  const editModalStatus = ref(false);
  const editUserLoading = ref(false);
  const editUserLogin = ref("");
  const editUserRoles = ref("");
  const editUserDepartments = ref("");
  const roleModal = ref("");
  const allRoles = ref();
  const allDepartments = ref(null);
  const departmentsModal = ref("");
  const $q = useQuasar();

  async function getUser() {
    editUserLoading.value = true;

    try {
      const oldUser = await usersService.getOne(userId);
      editUserLogin.value = oldUser.login;
      editUserRoles.value = oldUser.roles;
      editUserDepartments.value = oldUser.departments;
    } catch (error) {
      console.log(error);
    }
    editUserLoading.value = false;
  }

  async function editHandler(user) {
    editModalStatus.value = true;
    userId = user.id;
    getUser();

    try {
      allRoles.value = await rolesService.getAll();
      allDepartments.value = await departmentsService.getAll();
    } catch (error) {
      console.log(error);
    }
  }

  async function addRole() {
    try {
      const response = await rolesService.attachRole(roleModal.value.id, userId);
      await getUser();
      $q.notify({
        type: "positive",
        message: response.message,
      });
    } catch (error) {
      $q.notify({
        type: "negative",
        message: error,
      });
    }
  }

  async function removeRole() {
    try {
      const response = await rolesService.detachRole(roleModal.value.id, userId);
      await getUser();
      $q.notify({
        type: "positive",
        message: response.message,
      });
    } catch (error) {
      $q.notify({
        type: "negative",
        message: error,
      });
    }
  }

  async function attachDepartment() {
    try {
      const response = await departmentsService.attachToUser(departmentsModal.value.id, userId);
      await getUser();
      $q.notify({
        type: "positive",
        message: response.message,
      });
    } catch (error) {
      $q.notify({
        type: "negative",
        message: error,
      });
    }
  }

  async function detachDepartment() {
    try {
      const response = await departmentsService.detachFromUser(departmentsModal.value.id, userId);
      await getUser();
      $q.notify({
        type: "positive",
        message: response.message,
      });
    } catch (error) {
      $q.notify({
        type: "negative",
        message: error,
      });
    }
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
    attachDepartment,
    detachDepartment,
    allDepartments,
    editUserDepartments,
    departmentsModal,
  };
}
