<template>
  <div>
    <ul class="contacts" v-if="userData.contacts && userData.contacts.length">
      <li class="contact" v-for="(contact, idx) in userData.contacts" :key="contact.idx">
        <p class="text-bold">Контактное лицо №{{ idx + 1 }}</p>
        <q-input filled v-model="contact.name" label="Имя" class="q-mb-md" dense />
        <q-input
          filled
          v-model="contact.email"
          label="Email"
          dense
          :rules="[
            // (val) => !!val || 'Поле обязательно',
            (val, rules) => rules.email(val) || 'Введён не корректный адрес электронной почты',
          ]"
        />
        <q-input
          filled
          v-model="contact.phone"
          dense
          unmasked-value
          lazy-rules
          :rules="[(val) => val.length === 10 || 'Введите корректный телефон']"
          label="Рабочий Телефон"
          mask="+7 (###) ### ##-##"
        />
        <q-input
          filled
          v-model="contact.phone_add"
          dense
          unmasked-value
          lazy-rules
          :rules="[(val) => val.length === 10 || 'Введите корректный телефон']"
          label="Дополнительный телефон"
          mask="+7 (###) ### ##-##"
        />
        <q-input filled v-model="contact.comment" type="textarea" label="Комметарий" class="q-mb-md" dense />
        <q-select
          v-model="contact.job"
          :options="store.state.clients.metadata.jobs"
          label="Должность"
          map-options
          emit-value
          option-value="id"
          option-label="title"
          dense
          filled
          class="q-mb-md"
        />
        <q-btn label="Удалить контактное лицо" color="primary" @click="removeContact(idx)" />
      </li>
    </ul>
    <q-btn label="Добавить контактное лицо" color="primary" @click="addContact" />
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import useContacts from "./composables/useContacts";
import { useClients } from "./composables/useClients";
const { userData } = useClients();
const { removeContact, addContact } = useContacts();
const store = useStore();
</script>

<style scoped lang="scss">
.contacts {
  padding: 6px;
  border-radius: 8px;
  border: 1px solid #666;

  .contact {
    padding: 6px;
    border-radius: 8px;
    list-style: none;
    background-color: #e5ebf5;
    margin-bottom: 16px;
  }
}
</style>

<style lang="scss">
.bordered-box {
  padding: 6px;
  border-radius: 8px;
  border: 1px solid #666;
}
</style>
