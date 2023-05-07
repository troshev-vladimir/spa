import { onMounted, ref } from "vue";
import { useStore } from "vuex";

export default function useFetchUsers() {
  const store = useStore();

  const usersLoading = ref(false);

  onMounted(async () => {
    usersLoading.value = true;
    store.dispatch("users/fetchAllUsers").finally(() => {
      usersLoading.value = false;
    });
  });

  return {
    usersLoading,
  };
}
