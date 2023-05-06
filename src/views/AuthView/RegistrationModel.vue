<template>
  <q-dialog v-model="modal">
    <q-card class="q-pa-lg q-col-gutter-y-md modal">
      <q-toolbar>
        <q-toolbar-title>Регистрация</q-toolbar-title>

        <q-btn flat round dense v-close-popup>&times;</q-btn>
      </q-toolbar>
      <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
        <q-input
          outlined
          label="Email"
          v-model="newUser.email"
          dense
          :rules="[
            (val) => !!val || 'Поле обязательно',
            (val, rules) => rules.email(val) || 'Введён не корректный адрес электронной почты',
          ]"
          lazy-rules
        />
        <q-input
          outlined
          label="Логин"
          v-model="newUser.login"
          dense
          :rules="[
            (val) => !!val || 'Поле обязательно',
            (val) =>
              (val.length > 10 && val.length < 20) ||
              'Логин долже содержать не более 10 и не менее 20 символов сейчас ' + val.length,
          ]"
          lazy-rules
        />
        <q-input
          outlined
          type="password"
          label="Пароль"
          :rules="[(val) => !!val || 'Поле обязательно']"
          v-model="newUser.password"
          dense
          lazy-rules
        />
        <q-input
          outlined
          type="tel"
          label="Телефон"
          mask="+7 (###) ##-##-###"
          :rules="[(val) => val.length > 17 || 'Поле заполнено не корректно']"
          v-model="newUser.phone"
          dense
          lazy-rules
        />

        <q-btn class="q-py-xs bg-indigo-13" push label="Зарегистрироваться" @click="regHandler" />
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, watch } from "vue";
import useNewUser from "./composables/useNewUser";
// import useQuasar from "quasar/src/composables/use-quasar.js";
// const $q = useQuasar();
// $q.notify({
//   color: "green-4",
//   textColor: "white",
//   icon: "cloud_done",
//   message: "Submitted",
// });
// eslint-disable-next-line no-undef
const props = defineProps({
  modelValue: Boolean,
});
// eslint-disable-next-line no-undef
const emit = defineEmits("update:modelValue");

const { regHandler, newUser } = useNewUser();

const modal = ref(false);

watch(
  () => props.modelValue,
  (value) => {
    modal.value = value;
  }
);

watch(modal, (value) => {
  if (!value) emit("update:modelValue", false);
});
</script>

<style lang="scss" scoped>
.modal {
  min-width: 600px;
}
</style>
