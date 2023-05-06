<template>
  <q-form autofocus style="min-width: 400px">
    <q-input filled v-model="userData.name" label="Имя" class="q-mb-md" dense />
    <q-input filled v-model="userData.email" label="Email" class="q-mb-md" dense />
    <q-input filled v-model="userData.phone" label="Телефон" class="q-mb-md" dense />
    <q-input filled v-model="userData.phone_add" label="Дополнительный телефон" class="q-mb-md" dense />
    <q-input filled v-model="userData.site" label="Сайт" class="q-mb-md" dense />
    <q-input filled v-model="userData.vk" label="Вконтакте" class="q-mb-md" dense />
    <q-select
      v-model="userData.division_id"
      :options="selectedDepartmentDivisions"
      label="Отдел"
      option-value="id"
      option-label="name"
      dense
      filled
      class="q-mb-md"
    />

    <q-btn label="Submit" color="primary" @click="submitForm" />
    <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
  </q-form>
</template>

<script setup>
import { toRefs, defineProps, defineEmits } from "vue";
import { useStore } from "vuex";
const props = defineProps({
  userData: {
    type: Object,
    default: () => ({
      id: null,
      name: "",
      email: "",
      phone: "",
      phone_add: "",
      site: "",
      vk: "",
      birth_day: "",
    }),
  },
});
const emit = defineEmits(["submit"]);
const store = useStore();

const selectedDepartmentDivisions = store.state.department?.divisions;

const { userData } = toRefs(props);

const submitForm = () => {
  emit("submit", userData);
};
</script>

<style></style>
