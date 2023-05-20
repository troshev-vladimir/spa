<template>
  <ul class="items-redactor bordered-box">
    <li v-for="(item, id) in items" :key="id" class="q-mb-md row q-col-gutter-xs">
      <q-input filled v-model="item.title" dense class="q-mb-md col-12" label="Услуга" />
      <q-input filled v-model.number="item.summ" dense class="q-mb-md col-6" label="Цена" type="number" />
      <q-input filled v-model="item.amount" dense class="q-mb-md col-6" label="Кол-во" />
      <p class="col-9 q-pl-md">
        Сумма: <span class="text-bold">{{ item.summ * item.amount }}</span>
      </p>
      <q-btn class="col-3" @click="deleteItem(id)">Удалить</q-btn>
    </li>
  </ul>
  <div class="row items-center">
    <q-btn class="col-3 q-pl-md" @click="addItem">Добавить</q-btn>
    <p class="col-3 q-pl-md q-mb-none">
      Всего: <span class="text-bold">{{ total }}</span>
    </p>
  </div>
</template>

<script setup>
import { computed } from "vue";

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
  emit("update:items", items);
};

const total = computed(() => {
  return props.items.reduce((sum, current) => (sum += current.summ * current.amount), 0);
});

const deleteItem = (id) => {
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
