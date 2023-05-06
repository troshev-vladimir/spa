<template>
  <ul class="items-redactor">
    <li v-for="(item, id) in items" :key="id" class="q-mb-md row q-col-gutter-xs">
      <q-input filled v-model="item.title" dense class="q-mb-md col-12" label="Услуга" />
      <q-input filled v-model.number="item.summ" dense class="q-mb-md col-6" label="Цена" type="number" />
      <!-- <q-input
        filled
        v-model="item.summ"
        dense
        class="q-mb-md col-6"
        label="Цена"
      /> -->
      <q-btn class="offset-9 col-3" @click="deleteItem(id)">Удалить</q-btn>
    </li>
  </ul>
  <q-btn @click="addItem">Добавить</q-btn>
</template>

<script setup>
// eslint-disable-next-line no-undef
const props = defineProps({
  items: Array,
  item: Object,
  show: Boolean,
});
// eslint-disable-next-line no-undef
const emit = defineEmits(["update:items"]);

const addItem = () => {
  const items = props.items;
  items.push(JSON.parse(JSON.stringify(props.item)));
  console.log(props.items);
  emit("update:items", items);
};

const deleteItem = (id) => {
  console.log(props.items);
  const items = props.items;
  items.splice(id, 1);
  emit("update:items", items);
};
</script>

<style lang="scss">
.items-redactor {
  padding: 0;
}
</style>
