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
    setClientsPagination(state, arr) {
      state.clientsPagination = arr;
    },
  },
  actions: {
    async fetchAllClients({ commit, rootState }) {
      try {
        const result = await clientsService.getAll(rootState.department.id);
        commit("setClients", result.data);
        return result;
      } catch (error) {
        console.log(error);
      }
    },
  },
};

export default moduleB;
