<template>
  <q-input dense :model-value="value()" :mask="mask" :readonly="props.readonly" :label="props.label">
    <template v-slot:append>
      <q-icon v-if="!props.readonly" name="fa-solid fa-calendar-days" class="cursor-pointer" color="blue-7">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date v-model="data" today-btn mask="YYYY-MM-DD" :range="props.range">
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
import { computed } from "vue";
// eslint-disable-next-line no-undef
const emit = defineEmits(["update:modelValue"]);
// eslint-disable-next-line no-undef
const props = defineProps({
  modelValue: [String, Object],
  label: String,
  range: Boolean,
  readonly: Boolean,
});

const mask = computed(() => {
  return props.range ? "####-##-## - ####-##-##" : "####-##-##";
});

const value = () => {
  if (!data.value) return null;
  return typeof data.value === "object" ? `${data.value.from} - ${data.value.to}` : data.value;
};

const data = computed({
  get: () => {
    return props.modelValue;
  },
  set: (value) => {
    emit("update:modelValue", value);
  },
});
</script>

<style></style>
