import { ref } from "vue";
import { useRouter } from "vue-router";
import authService from "@/api/auth";
import { useQuasar } from "quasar";

export default function useNewUser() {
  const router = useRouter();
  const $q = useQuasar();

  const newUserName = ref("");
  const newUserPassword = ref("");

  async function regHandler() {
    try {
      await authService.registration({
        email: newUserName.value,
        login: "test",
        password: newUserPassword.value,
      });
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
    regHandler,
    newUserName,
    newUserPassword,
  };
}
