import { useClients } from "./useClients";

export default function useContacts() {
  const { userData } = useClients();

  function removeContact(id) {
    userData.value.contacts.splice(id, 1);
  }

  function addContact() {
    userData.value.contacts.push({
      name: "",
      phone: "",
      phone_add: "",
      email: "",
      comment: "",
      job: null,
    });
  }

  return { removeContact, addContact };
}
