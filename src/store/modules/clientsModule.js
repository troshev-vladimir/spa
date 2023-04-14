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
    async fetchAllClients({ commit }) {
      try {
        const result = await clientsService.getAll();
        commit("setClients", result);
      } catch (error) {
        console.log(error);
      }
    },
    async fetchAllClientsByDepartment({ commit, rootState }) {
      try {
        const result = await clientsService.getAllByDepartment(
          rootState.department.id
        );
        commit("setClients", result);
      } catch (error) {
        console.log(error);
      }
    },
  },
};

export default moduleB;
