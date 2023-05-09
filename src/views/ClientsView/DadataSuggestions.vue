<template>
  <div class="contact">
    <q-select
      v-model="selected"
      :options="companySuggestions"
      @filter="onFilter"
      label="Юридическое лицо"
      aria-placeholder="sdf"
      map-options
      emit-value
      option-value="data.inn"
      option-label="value"
      dense
      filled
      use-input
      input-debounce="0"
      class="q-mb-xs"
      clearable
      options-dense
    />

    <div v-if="selected">
      <q-input label="Адрес" outlined :modelValue="selected?.data?.address?.value || null" readonly dense />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
// eslint-disable-next-line no-undef
const emit = defineEmits(["select"]);

const query = ref(null);
const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
const token = "3015b65404c060dcc9aacd5732122a53d87d1294";
const companySuggestions = ref([]);

function onFilter(val, update) {
  query.value = val;
  update();
}

const selected = ref(null);

watch(selected, () => {
  emit("select", selected.value);
});

watch(query, () => {
  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Token " + token,
    },
    body: JSON.stringify({ query: +query.value }),
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      companySuggestions.value = result.suggestions;
    })
    .catch((error) => console.log("error", error));
});
</script>

<style scoped>
.contact {
  padding: 6px;
  border-radius: 8px;
  border: 1px solid #666;
}
</style>
