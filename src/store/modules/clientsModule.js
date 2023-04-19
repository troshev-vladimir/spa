import clientsService from "@/api/clients";
const moduleB = {
  namespaced: true,

  state: () => ({
    clientsData: [],
  }),
  mutations: {
    setClients(state, arr) {
      state.clientsData = arr;
    },
  },
  actions: {
    async fetchAllClients({ commit, rootState }) {
      try {
        const result = await clientsService.getAll(rootState.department.id);
        commit("setClients", result);
      } catch (error) {
        console.log(error);
      }
    },
  },
};

export default moduleB;
