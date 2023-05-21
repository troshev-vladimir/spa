import { onMounted, ref, watch } from "vue";
import departmentsService from "@/api/departments";
import { useStore } from "vuex";
import { useQuasar } from "quasar";

export default function () {
  const selectedDepartment = ref(null);
  const allDepartments = ref(null);
  const store = useStore();
  const departmentLoading = ref(false);
  const $q = useQuasar();

  watch(selectedDepartment, (newValue) => {
    store.commit("setDepartment", newValue);
    localStorage.setItem("lastDepartment", JSON.stringify(selectedDepartment.value));
  });

  onMounted(async () => {
    departmentLoading.value = true;
    try {
      await store.dispatch("user/getCurrentUser");
      allDepartments.value = await departmentsService.getByUser(store.state.user.user.id);
    } catch (error) {
      console.log(error);
    }

    if (!store.state.user.user.departments || !store.state.user.user.departments.length) {
      $q.notify({
        type: "negative",
        message: "Вам не назначен ни один Департамент",
      });
    }
    departmentLoading.value = false;

    if (allDepartments.value?.length) {
      const lastDepartment = localStorage.getItem("lastDepartment");
      selectedDepartment.value = JSON.parse(lastDepartment) || allDepartments.value[0];
    }
  });

  return {
    selectedDepartment,
    allDepartments,
    departmentLoading,
  };
}
