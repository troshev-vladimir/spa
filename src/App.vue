<template>
  <q-layout class="text-body1">
    <component :is="layout()"> <router-view /> </component>
  </q-layout>
</template>

<script>
import DefaultLayout from "./layouts/DefaultLayout.vue";
import EmptyLayout from "./layouts/EmptyLayout.vue";

export default {
  components: { EmptyLayout, DefaultLayout },
  methods: {
    layout() {
      return this.$route.meta.layout;
    },
  },
};
</script>

<style lang="scss"></style>
