<template>
  <q-header class="q-pa-md">
    <div class="row justify-between items-center">
      <div class="actions">
        <q-btn
          v-if="store.state.user.user.id"
          class="q-px-xl q-py-xs bg-indigo-13 q-mr-md"
          push
          label="Выйти"
          @click="exitHandler"
        />
        <q-btn
          v-else
          class="q-px-xl q-py-xs bg-indigo-13 q-mr-md"
          push
          label="Войти"
          @click="enterHandler"
        />
      </div>
      <div class="user column">
        <span>{{ store.state.user.user.login }}</span>
        <div class="row">
          <span v-for="role in store.state.user.user.roles" :key="role">
            {{ role.name }},
          </span>
        </div>
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
import authService from "@/api/auth";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
const router = useRouter();
const store = useStore();

async function exitHandler() {
  await authService.logout();
  router.push("auth");
}

async function enterHandler() {
  router.push("auth");
}
</script>

<style></style>
