<!-- eslint-disable no-unused-vars -->
<template>
  <form class="row q-mb-lg q-col-gutter-lg">
    <div class="col-6 q-mb-md">
      <q-input outlined label="Имя пользователя" v-model="userName" dense />
    </div>
    <div class="col-6">
      <q-input
        mask="+7 (###) ## ## ###"
        outlined
        label="Телефон пользователя"
        v-model="userPhone"
        dense
      />
    </div>
  </form>
</template>

<script setup>
import { defineEmits, defineProps, ref, watch } from "vue";
import { useRouter } from "vue-router";
const props = defineProps({
  filter: Object,
});

const router = useRouter();
const emit = defineEmits(["update:filter"]);

const userName = ref(props.filter.name);
const userPhone = ref(props.filter.phone);

watch([userName, userPhone], ([newUserName, newUserPhone]) => {
  emit("update:filter", { name: newUserName, phone: newUserPhone });
  const query = { name: userName.value, phone: userPhone.value };

  Object.keys(query).forEach((key) => {
    if (!query[key]) {
      delete query.key;
    }
  });

  router.push({ query });
});
</script>
