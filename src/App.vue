<template>
  <q-layout class="text-body1">
    <component :is="layout()"> <router-view /> </component>
  </q-layout>
</template>

<script>
import { mapActions } from "vuex";
import DefaultLayout from "./layouts/DefaultLayout.vue";
import EmptyLayout from "./layouts/EmptyLayout.vue";
export default {
  components: { EmptyLayout, DefaultLayout },
  methods: {
    ...mapActions({ fetchUser: "user/getCurrentUser" }),
    layout() {
      return this.$route.meta.layout;
    },
  },
  mounted() {
    this.fetchUser();
  },
};
</script>

<style lang="scss"></style>
