<template>
  <div class="contact">
    <q-select
      v-model="selected"
      :options="companySuggestions"
      @filter="onFilter"
      label="Юридическое лицо"
      map-options
      emit-value
      option-value="data.inn"
      option-label="value"
      dense
      filled
      use-input
      input-debounce="500"
      class="q-mb-xs"
      clearable
      options-dense
    />

    <q-input label="Адрес" filled v-model="selected.data.address.value" dense class="q-mb-xs" />
    <q-input label="ОГРН" filled v-model="selected.data.ogrn" dense class="q-mb-xs" />
    <q-input label="ИНН" filled v-model="selected.data.inn" dense class="q-mb-xs" />
    <q-input label="Адрес" filled v-model="selected.data.opf.full" dense class="q-mb-xs" />
    <q-input label="Руководитель" filled v-model="selected.data.management.name" dense class="q-mb-xs" />

    <q-select
      v-model="selectedBank"
      :options="bankSuggestions"
      @filter="onFilterBank"
      label="Банк"
      map-options
      emit-value
      option-value="data.inn"
      option-label="value"
      dense
      filled
      use-input
      input-debounce="500"
      class="q-mb-xs"
      clearable
      options-dense
    />

    <q-input label="БИК" filled v-model="selectedBank.data.bic" dense class="q-mb-xs" />
    <q-input label="ИНН" filled v-model="selectedBank.data.inn" dense class="q-mb-xs" />
    <q-input label="КПП" filled v-model="selectedBank.data.kpp" dense class="q-mb-xs" />
    <q-input label="Кор.счёт" filled v-model="selectedBank.data.correspondent_account" dense class="q-mb-xs" />
    <q-input label="Расчётный счёт" filled v-model="selectedBank.data.payAccount" dense class="q-mb-xs" />
    <q-input label="Комментарий" filled v-model="selectedBank.data.comment" dense type="textarea" class="q-mb-xs" />
  </div>
</template>

<script setup>
import { ref } from "vue";
// eslint-disable-next-line no-undef
const selected = ref({
  value: "",
  data: {
    opf: {
      full: "",
    },
    ogrn: "",
    inn: "",
    address: {
      value: "",
    },
    management: {
      name: "",
    },
  },
});

const selectedBank = ref({
  data: {
    bic: "",
    payAccount: "",
    correspondent_account: "",
    inn: "",
    kpp: "",
    comment: "",
  },
  value: "",
});

const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
const urlBank = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/bank";
const token = "3015b65404c060dcc9aacd5732122a53d87d1294";
const companySuggestions = ref([]);
const bankSuggestions = ref([]);

function onFilter(val, update) {
  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Token " + token,
    },
    body: JSON.stringify({ query: +val }),
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      companySuggestions.value = result.suggestions;
      update();
    })
    .catch((error) => console.log("error", error));
}

function onFilterBank(val, update) {
  const options = {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Token " + token,
    },
    body: JSON.stringify({ query: val }),
  };

  fetch(urlBank, options)
    .then((response) => response.json())
    .then((result) => {
      bankSuggestions.value = result.suggestions;
      // companySuggestions.value = result.suggestions;
      update();
    })
    .catch((error) => console.log("error", error));
}
</script>

<style scoped>
.contact {
  padding: 6px;
  border-radius: 8px;
  border: 1px solid #666;
}
</style>
