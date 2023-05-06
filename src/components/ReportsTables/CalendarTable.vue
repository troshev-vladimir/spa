<template>
  <q-table title="Календарь приходов" :rows="rows" :columns="columns" row-key="name" />
</template>

<script setup>
const columns = [
  { name: "date", label: "Дата прихода", field: "date", sortable: true },
  {
    name: "summ",
    label: "Сумма",
    field: "summ",
    // sort: (a, b) => parseInt(a, 10) - parseInt(b, 10),
  },
];
</script>

<style scoped lang="scss">
.buttons {
  column-gap: 20px;
  margin-bottom: 20px;
}
</style>
