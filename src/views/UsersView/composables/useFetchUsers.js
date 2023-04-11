import { onMounted, ref } from "vue";
import rolesService from "@/api/roles";
import { useStore } from "vuex";

export default function useFetchUsers() {
  const store = useStore();
  const allRoles = ref();
  const usersLoading = ref(false);

  onMounted(async () => {
    usersLoading.value = true;
    store.dispatch("users/fetchAllUsers").finally(() => {
      usersLoading.value = false;
    });

    try {
      allRoles.value = await rolesService.getAll();
    } catch (error) {
      console.log(error);
    }
  });

  return {
    allRoles,
    usersLoading,
  };
}
