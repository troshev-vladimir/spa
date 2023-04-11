import { onMounted, ref, watch } from "vue";
import departmentsService from "@/api/departments";
import { useStore } from "vuex";
export default function () {
  const selectedDepartment = ref(null);
  const allDepartments = ref(0);
  const store = useStore();
  const departmentLoading = ref(false);

  watch(selectedDepartment, (newValue) => {
    store.commit("setDepartment", newValue);
  });

  onMounted(async () => {
    departmentLoading.value = true;
    try {
      allDepartments.value = await departmentsService.getAll();
    } catch (error) {
      console.log(error);
    }
    departmentLoading.value = false;
    selectedDepartment.value = allDepartments.value[0];
  });

  return {
    selectedDepartment,
    allDepartments,
    departmentLoading,
  };
}
