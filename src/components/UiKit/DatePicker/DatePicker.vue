<template>
  <q-input filled dense v-model="data" mask="####-##-##" :range="props.range">
    <template v-slot:append>
      <q-icon name="edit" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="data" today-btn mask="YYYY-MM-DD">
            <div class="row items-center justify-end">
              <q-btn v-close-popup label="Close" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>

<script setup>
import { ref, watch } from "vue";
// eslint-disable-next-line no-undef
const emit = defineEmits(["update:modelValue"]);
// eslint-disable-next-line no-undef
const props = defineProps({
  modelValue: String,
  range: Boolean,
});

const data = ref(props.modelValue);

watch(data, () => {
  emit("update:modelValue", data);
});
</script>

<style></style>
