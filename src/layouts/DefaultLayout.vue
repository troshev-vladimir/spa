<template>
  <q-header class="q-pa-md bg-blue-grey-2" elevated>
    <div class="row q-col-gutter-md">
      <div class="col-auto grow-none items-center flex">
        <a class="logo" href="https://www.salesgear.ru/">
          <img src="/logo.png" class="logo" alt="logo" />
        </a>
      </div>
      <div class="col-auto items-center flex">
        <q-badge class="q-pa-sm bg-blue-3 text-grey-10">
          <div class="day">{{ day }}</div>
          <q-icon class="text-primary q-mx-sm" size="1.2em" name="fa-regular fa-clock" /> {{ now }}
        </q-badge>
      </div>
      <div class="col"></div>
      <div class="col-3 items-center flex" v-if="store.state.user.user.departments?.length">
        <q-select
          style="width: 100%"
          v-model="selectedDepartment"
          filled
          :options="store.state.user.user.departments"
          label="Департамент"
          option-value="id"
          option-label="name"
          dense
          bg-color="blue-3"
          :loading="departmentLoading"
        />
      </div>

      <div class="col-auto items-center flex" v-if="store.state.user.user.login">
        <q-badge class="q-pa-sm bg-blue-3 text-grey-10">
          <span class="q-mr-xs text-body1 text-bold">{{ store.state.user.user.login }}</span>
          <q-badge class="q-pa-sm bg-blue-5">
            <div class="row">
              <span v-for="role in store.state.user.user.roles" :key="role"> {{ role.name }}, </span>
            </div>
            <!-- {{ store.state.user.user.roles[store.state.user.user.roles.length - 1].name }} -->
          </q-badge>
        </q-badge>
      </div>

      <div class="col-auto items-center flex">
        <q-btn
          v-if="isAdmin && route.name !== 'users'"
          class="q-px-xl q-py-xs bg-indigo-13 q-mr-md"
          push
          label="Админка"
          @click="router.push({ name: 'users' })"
        />

        <q-btn v-else class="q-px-xl q-py-xs bg-indigo-13 q-mr-md" push label="crm" @click="router.push({ name: 'crm' })" />

        <q-btn
          v-if="store.state.user.user.id"
          class="q-px-xl q-py-xs bg-indigo-13 q-mr-md"
          push
          label="Выйти"
          @click="exitHandler"
        />
        <q-btn v-else class="q-px-xl q-py-xs bg-indigo-13 q-mr-md" push label="Войти" @click="enterHandler" />
      </div>
    </div>
  </q-header>
  <q-page-container>
    <q-page class="q-pa-lg">
      <router-view></router-view>
    </q-page>
  </q-page-container>
  <q-footer class="q-pa-md"></q-footer>
</template>

<script setup>
import useDepartments from "./composables/useDepartments.js";
import authService from "@/api/auth";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
import { useNow, useDateFormat } from "@vueuse/core";
import { computed } from "vue";

const router = useRouter();
const route = useRoute();
const store = useStore();
const now = useDateFormat(useNow(), "YYYY.MM.DD HH:mm:ss");
const day = useDateFormat(useNow(), "dddd");
const { selectedDepartment, departmentLoading } = useDepartments();
async function exitHandler() {
  await authService.logout();
  router.push({ name: "auth" });
}

const isAdmin = computed(() => {
  return (
    store.state.user.user?.roles?.findIndex((el) => {
      return el.name === "Admin";
    }) + 1
  );
});

async function enterHandler() {
  router.push({ name: "auth" });
}
</script>

<style lang="scss">
.logo {
  width: 40px;
  height: 40px;
  animation: rotate-logo 5s linear infinite;
}

@keyframes rotate-logo {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.now {
  align-items: center;
  display: flex;
}

.day {
  text-transform: capitalize;
  font-weight: 600;
}
</style>
