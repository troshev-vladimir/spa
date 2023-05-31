export default function useDadata(userData) {
  function addLegalHandler() {
    userData.value.legals.push({
      legal_entity: "",
      legal_address: "",
      address: "",
      ogrn: "",
      inn: "",
      opf: "",
      leader_name: "",
      accouter_name: "",
      bank: "",
      bic: "",
      inn_bank: "",
      kpp: "",
      r_count: "",
      k_count: "",
      comment: "",
    });
  }

  function removeLegalHandler(legal) {
    userData.value.legals = userData.value.legals.filter((el) => {
      return legal !== el;
    });
  }

  return { addLegalHandler, removeLegalHandler };
}
