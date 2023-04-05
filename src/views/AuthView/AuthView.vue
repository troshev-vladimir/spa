<template>
  <div class="q-pa-md">
    <div class="row q-mb-lg">
      <div class="col-12 q-mb-md">
        <q-input outlined label="Имя пользователя" v-model="userName" dense />
      </div>
      <div class="col-12">
        <q-input
          outlined
          label="Пароль"
          type="password"
          v-model="userPassword"
          dense
        />
      </div>
    </div>
    <div class="row">
      <div class="col">
        <q-btn
          class="q-px-xl q-py-xs bg-indigo-13 q-mr-md"
          push
          label="Войти"
          :disable="buttonDisable"
          @click="authHandler"
        />
        <q-btn
          class="q-px-xl q-py-xs bg-indigo-13"
          push
          label="Зарегистрироваться"
          @click="registration = true"
        />
      </div>
    </div>

    <q-dialog v-model="registration">
      <q-card class="q-pa-lg q-col-gutter-y-md">
        <q-input
          outlined
          label="Email"
          v-model="newUserName"
          dense
          :rules="[(val) => !!val || 'Поле обязательно']"
        />
        <q-input
          outlined
          type="password"
          label="Пароль"
          :rules="[(val) => !!val || 'Поле обязательно']"
          v-model="newUserPassword"
          dense
        />
        <!-- <q-input
          ref="newUserPhoneInput"
          outlined
          label="Телефон"
          type="tel"
          mask="+7 (###) ## ## ###"
          :rules="[
            (val) => !!val || 'Поле обязательно',
            (val) => val.length > 17 || 'Поле заполнено не корректно',
          ]"
          v-model="newUserPhone"
          dense
        /> -->

        <q-card-actions>
          <q-btn
            class="q-px-xl q-py-xs bg-indigo-13 q-mr-md"
            push
            label="Закрыть"
            @click="registration = false"
          />
          <q-btn
            class="q-px-xl q-py-xs bg-indigo-13"
            push
            label="Зарегистрироваться"
            @click="regHandler"
            :disable="!newUserName || !newUserPassword"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import useNewUser from "./composables/useNewUser";
import useUserAuth from "./composables/useUserAuth";

const { regHandler, newUserName, newUserPassword } = useNewUser();
const { authHandler, userName, userPassword } = useUserAuth();

const registration = ref(false);
const buttonDisable = ref(true);

watch([userName, userPassword], ([name, password]) => {
  if (name && password) {
    buttonDisable.value = false;
  } else {
    buttonDisable.value = true;
  }
});
</script>
