import clientsService from "@/api/clients";
const moduleB = {
  namespaced: true,

  state: () => ({
    clientsData: [],
    clientsPagination: null,
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
        commit("setClientsPagination", result.meta);

        return result;
      } catch (error) {
        console.log(error);
      }
    },
  },
};

export default moduleB;
