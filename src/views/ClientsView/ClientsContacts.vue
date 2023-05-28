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
            (val, rules) => (val ? rules.email(val) : true || 'Введён не корректный адрес электронной почты'),
          ]"
        />
        <q-input
          filled
          v-model="contact.phone"
          dense
          unmasked-value
          lazy-rules
          :rules="[(val) => (val ? val.length === 10 : true || 'Введите корректный телефон')]"
          label="Рабочий Телефон"
          mask="+7 (###) ### ##-##"
        />
        <q-input
          filled
          v-model="contact.phone_add"
          dense
          unmasked-value
          lazy-rules
          :rules="[(val) => (val ? val.length === 10 : true || 'Введите корректный телефон')]"
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
          :display-value="contact.job ? contact.job.title : 'Не выбрано'"
        />

        <q-btn color="negative" @click="removeContact(idx)">
          <q-icon class="q-mr-md" size="1.3em" name="fas fa-minus" />
          Удалить
        </q-btn>
      </li>
    </ul>
    <q-btn color="primary" @click="addContact" class="items-center row">
      <q-icon class="q-mr-md" size="1.3em" name="fas fa-plus" />
      Добавить контактное лицо
    </q-btn>
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

<style lang="scss">
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
