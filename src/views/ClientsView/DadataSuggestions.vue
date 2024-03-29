<template>
  <div class="contact">
    <q-select
      v-model="selected"
      :options="companySuggestions"
      @filter="onFilter"
      label="Юридическое лицо"
      map-options
      option-value="data.inn"
      option-label="value"
      dense
      filled
      hide-selected
      fill-input
      use-input
      input-debounce="200"
      class="q-mb-xs"
      options-dense
    />

    <q-input label="Юридический Адрес" filled v-model="selected.data.address.value" dense class="q-mb-xs" />
    <q-input label="Фактический Адрес" filled v-model="actualAddress" dense class="q-mb-xs" />
    <q-input label="ОГРН" filled v-model="selected.data.ogrn" dense class="q-mb-xs" />
    <q-input label="ИНН" filled v-model="selected.data.inn" dense class="q-mb-xs" />
    <q-input label="ОПФ" filled v-model="selected.data.opf.full" dense class="q-mb-xs" />
    <q-input label="Руководитель" filled v-model="selected.data.management.name" dense class="q-mb-xs" />
    <q-input label="Бухгалтер" filled v-model="accouterName" dense class="q-mb-xs" />

    <q-select
      v-model="selectedBank"
      :options="bankSuggestions"
      @filter="onFilterBank"
      label="Банк"
      map-options
      option-value="data.inn"
      option-label="value"
      dense
      filled
      hide-selected
      fill-input
      use-input
      input-debounce="200"
      class="q-mb-xs"
      options-dense
    />

    <q-input label="БИК" filled v-model="selectedBank.data.bic" dense class="q-mb-xs" />
    <q-input label="ИНН" filled v-model="selectedBank.data.inn" dense class="q-mb-xs" />
    <q-input label="КПП" filled v-model="selectedBank.data.kpp" dense class="q-mb-xs" />
    <q-input label="Кор.счёт" filled v-model="selectedBank.data.correspondent_account" dense class="q-mb-xs" />
    <q-input label="Расчётный счёт" filled v-model="payAccount" dense class="q-mb-xs" />
    <q-input label="Комментарий" filled v-model="comment" dense type="textarea" class="q-mb-xs" />
    <q-btn color="negative" @click="emit('remove')">
      <q-icon class="q-mr-md" size="1.3em" name="fas fa-minus" />
      Удалить
    </q-btn>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
// eslint-disable-next-line no-undef
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});
// eslint-disable-next-line no-undef
const emit = defineEmits(["update:modelValue", "remove"]);
const payAccount = ref(props.modelValue.r_count);
const comment = ref(props.modelValue.comment);
const actualAddress = ref(props.modelValue.address);
const accouterName = ref(props.modelValue.accouter_name);
const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";
const urlBank = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/bank";
const token = "3015b65404c060dcc9aacd5732122a53d87d1294";
const companySuggestions = ref([]);
const bankSuggestions = ref([]);

const selected = ref({
  value: props.modelValue.legal_entity,
  data: {
    opf: {
      full: props.modelValue.opf,
    },
    ogrn: props.modelValue.ogrn,
    inn: props.modelValue.inn,
    address: {
      value: props.modelValue.legal_address,
    },
    management: {
      name: props.modelValue.leader_name,
    },
  },
});

const selectedBank = ref({
  value: props.modelValue.bank,
  data: {
    bic: props.modelValue.bic,
    payAccount: props.modelValue.r_count,
    correspondent_account: props.modelValue.k_count,
    inn: props.modelValue.inn_bank,
    kpp: props.modelValue.kpp,
  },
});

const onFilter = (val, update) => {
  selected.value.value = val;
  transformDataBack();
  if (!val) {
    companySuggestions.value = [];
    update();
    return;
  }
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

  fetch(url, options)
    .then((response) => response.json())
    .then((result) => {
      companySuggestions.value = result.suggestions;
      update();
    })
    .catch((error) => console.log("error", error));
};

function onFilterBank(val, update) {
  selectedBank.value.value = val;
  transformDataBack();
  if (!val) {
    bankSuggestions.value = [];
    update();
    return;
  }
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
      update();
    })
    .catch((error) => console.log("error", error));
}

watch(
  [selected, payAccount, comment, selectedBank, actualAddress, accouterName],
  () => {
    transformDataBack();
  },
  { deep: true }
);

const transformDataBack = () => {
  const vlaue = {};
  vlaue.legal_entity = selected.value.value;
  vlaue.opf = selected.value.data.opf.full;
  vlaue.ogrn = selected.value.data.ogrn;
  vlaue.inn = selected.value.data.inn;
  vlaue.legal_address = selected.value.data.address.value;
  vlaue.address = actualAddress.value;
  vlaue.leader_name = selected.value.data.management.name;
  vlaue.accouter_name = accouterName.value;

  vlaue.bank = selectedBank.value.value;
  vlaue.bic = selectedBank.value.data.bic;
  vlaue.r_count = payAccount.value;
  vlaue.k_count = selectedBank.value.data.correspondent_account;
  vlaue.inn_bank = selectedBank.value.data.inn;
  vlaue.kpp = selectedBank.value.data.kpp;
  vlaue.comment = comment.value;
  vlaue.id = props.modelValue.id;
  emit("update:modelValue", vlaue);
};
</script>

<style scoped>
.contact {
  padding: 6px;
  border-radius: 8px;
  border: 1px solid #666;
}
</style>
