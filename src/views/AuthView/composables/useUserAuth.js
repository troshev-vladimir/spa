import { ref } from "vue";
import { useRouter } from "vue-router";
// import { useStore } from "vuex";
import { useQuasar } from "quasar";
import authService from "@/api/auth";
import { useStore } from "vuex";

export default function () {
  //   const store = useStore();
  const $q = useQuasar();
  const router = useRouter();
  const store = useStore();

  const userName = ref("");
  const userPassword = ref("");

  async function authHandler() {
    try {
      const { user } = await authService.login({
        email: userName.value,
        password: userPassword.value,
      });
      store.commit("user/setUser", user);
    } catch (error) {
      console.log(error);
      $q.notify({
        type: "positive",
        message: "Что-то не так ",
      });
      return;
    }

    router.push({ path: "/" });
    $q.notify({
      type: "positive",
      message: "Вы успешно залогированы",
    });
  }

  return {
    authHandler,
    userName,
    userPassword,
  };
}
