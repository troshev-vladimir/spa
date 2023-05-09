import clientsService from "@/api/clients";
const moduleB = {
  namespaced: true,

  state: () => ({
    clientsData: [],
    metadata: {
      jobs: [],
      activitys: [],
      potentials: [],
    },
  }),
  mutations: {
    setClients(state, arr) {
      state.clientsData = arr;
    },
    setClientsPagination(state, arr) {
      state.clientsPagination = arr;
    },

    setClientsMetadata(state, payload) {
      state.metadata = payload;
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
    async fetchMetadata({ commit }) {
      try {
        const result = await clientsService.getMetadata();
        commit("setClientsMetadata", result);
        return result;
      } catch (error) {
        console.log(error);
      }
    },
  },
};

export default moduleB;
