import { ref, watchEffect } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
export default function useFilters(pagination) {
  const userLogin = ref();
  const userRole = ref();
  const router = useRouter();
  const route = useRoute();
  const store = useStore();

  watchEffect(() => {
    const query = Object.assign({}, pagination.value, {
      login: userLogin.value,
      role: userRole.value,
    });

    router.push({
      path: route.path,
      query,
    });
  });

  function sendFilters() {
    store.dispatch("users/fetchAllUsers");
  }

  return {
    userRole,
    userLogin,
    sendFilters,
  };
}
