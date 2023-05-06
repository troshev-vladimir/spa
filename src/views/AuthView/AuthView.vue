<template>
  <div class="q-pa-md">
    <div class="row q-mb-lg">
      <div class="col-12 q-mb-md">
        <q-input outlined label="Имя пользователя" v-model="userName" dense />
      </div>
      <div class="col-12">
        <q-input outlined label="Пароль" type="password" v-model="userPassword" dense />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <q-btn class="q-px-xl q-py-xs bg-indigo-13 q-mr-md" push label="Войти" :disable="buttonDisable" @click="authHandler" />
        <q-btn class="q-px-xl q-py-xs bg-indigo-13" push label="Зарегистрироваться" @click="registration = true" />
      </div>
    </div>

    <RegistrationModel v-model="registration"></RegistrationModel>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import useUserAuth from "./composables/useUserAuth";
import RegistrationModel from "./RegistrationModel.vue";

const { authHandler, userName, userPassword } = useUserAuth();

const buttonDisable = ref(true);
const registration = ref(false);

watch([userName, userPassword], ([name, password]) => {
  if (name && password) {
    buttonDisable.value = false;
  } else {
    buttonDisable.value = true;
  }
});
</script>
