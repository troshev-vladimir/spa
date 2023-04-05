<template>
  <q-table
    title="Задолжености"
    :rows="data"
    :columns="columns"
    row-key="name"
    align="center"
    separator="vertical"
  >
    <template #header-cell="{ col }">
      <q-th class="resizable">
        {{ col.label }}
      </q-th>
    </template>
    <template #body-cell="{ value }">
      <q-td class="cell">
        {{ value }}
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
const columns = [
  {
    align: "center",
    name: "name",
    label: "Имя пользователя",
    field: "name",
  },
  {
    align: "center",
    name: "debt",
    label: "Долг",
    sortable: true,
    field: "debt",
    // sort: (a, b) => ,
  },
  {
    align: "center",
    name: "reason",
    field: "reason",
    label: "Наименование",
  },
];
const data = [
  {
    name: "Николай Николаич",
    debt: "123 343p",
    reason: "По причине ...",
  },
  {
    name: "Василий Пупкин",
    debt: "1 343p",
    reason:
      "По причине ыфвфывфыв ыфв фыв фыв фывфыв фывфы ыфв фввфывыфв вывы фв фвф ",
  },
];
</script>

<style scoped lang="scss">
.buttons {
  column-gap: 20px;
  margin-bottom: 20px;
}
.cell {
  min-width: 20px;
  white-space: wrap;
}
.resizable {
  resize: horizontal;
  overflow: auto;
  background-color: #a9beff;
}
</style>
