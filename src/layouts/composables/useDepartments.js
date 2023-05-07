import { onMounted, ref, watch } from "vue";
import departmentsService from "@/api/departments";
import { useStore } from "vuex";

export default function () {
  const selectedDepartment = ref(null);
  const allDepartments = ref(null);
  const store = useStore();
  const departmentLoading = ref(false);

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
    departmentLoading.value = false;

    if (allDepartments.value.length) {
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
