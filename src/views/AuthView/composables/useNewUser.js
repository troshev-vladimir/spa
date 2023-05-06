import { reactive } from "vue";
import { useRouter } from "vue-router";
import authService from "@/api/auth";
import { useQuasar } from "quasar";
import { useStore } from "vuex";
export default function useNewUser() {
  const router = useRouter();
  const $q = useQuasar();
  const store = useStore();
  const newUser = reactive({
    email: "",
    login: "",
    password: "",
    phone: "",
  });

  async function regHandler() {
    try {
      const { user } = await authService.registration({
        email: newUser.email,
        login: newUser.login,
        password: newUser.password,
        phone: newUser.phone,
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

    router.push({ name: "crm" });
    $q.notify({
      type: "positive",
      message: "Вы успешно Зарегистрированы",
    });
  }

  return {
    regHandler,
    newUser,
  };
}
