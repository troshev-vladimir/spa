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
      <div class="col-grow row">
        <q-select
          v-model="selectedDepartment"
          filled
          :options="allDepartments"
          label="Департамент"
          option-value="id"
          option-label="name"
          dense
          class="offset-8 col-3"
          bg-color="blue-2"
          :loading="departmentLoading"
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
  <q-drawer
    v-model="drawer"
    show-if-above
    :mini="miniState"
    @mouseover="miniState = false"
    @mouseout="miniState = true"
    :width="200"
    :breakpoint="500"
    bordered
    :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
  >
    <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
      <q-list padding>
        <q-item clickable v-ripple @click="router.push({ name: 'crm' })">
          <q-item-section avatar> CRM </q-item-section>

          <q-item-section> CRM система </q-item-section>
        </q-item>

        <q-item clickable v-ripple @click="router.push({ name: 'users' })">
          <q-item-section avatar> Users</q-item-section>

          <q-item-section> Пользователи </q-item-section>
        </q-item>
      </q-list>
    </q-scroll-area>
  </q-drawer>
  <q-footer class="q-pa-md"></q-footer>
</template>

<script setup>
import useDepartments from "./composables/useDepartments.js";
import authService from "@/api/auth";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { onMounted, ref } from "vue";
const router = useRouter();
const store = useStore();
const drawer = ref(false);
const miniState = ref(true);
const { selectedDepartment, allDepartments, departmentLoading } =
  useDepartments();
async function exitHandler() {
  await authService.logout();
  router.push("auth");
}
onMounted(() => {
  store.dispatch("user/getCurrentUser");
});

async function enterHandler() {
  router.push("auth");
}
</script>

<style></style>
