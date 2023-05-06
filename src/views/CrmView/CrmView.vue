<template>
  <div class="container">
    <div class="row wrap buttons">
      <router-link v-for="link in links" :key="link.name" custom :to="{ name: link.name }" v-slot="{ navigate, isActive }">
        <q-btn @click="navigate" class="col col-grow" :class="{ 'router-link-active': isActive }">{{ link.title }}</q-btn>
      </router-link>
    </div>
    <div class="q-pa-md"><router-view /></div>
  </div>
</template>

<script setup>
// import { useRouter } from "vue-router";

// const router = useRouter();
const links = [
  { name: "clients", title: "Клиенты" },
  { name: "events", title: "События" },
  { name: "sales", title: "Продажи" },
  { name: "incomes", title: "Поступления" },
  { name: "reports", title: "Отчёты" },
];
</script>

<style scoped lang="scss">
.buttons {
  margin-bottom: 20px;
}

.router-link-active {
  background-color: rgb(76, 99, 177);
  color: #fff;
}
</style>
