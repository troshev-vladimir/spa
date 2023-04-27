import salesService from "@/api/sales";
const sales = {
  namespaced: true,

  state: () => ({
    salesData: [],
    salesTypes: [],
    salesSmi: [],
  }),
  mutations: {
    setSales(state, arr) {
      state.salesData = arr;
    },

    setSalesTypes(state, arr) {
      state.salesTypes = arr;
    },

    setSmi(state, arr) {
      state.salesSmi = arr;
    },
  },
  actions: {
    async fetchAllSales({ commit }) {
      try {
        const result = await salesService.getAll();
        commit("setSales", result.data);
        return result;
      } catch (error) {
        console.log(error);
      }
    },
    async fetchAllTypes({ commit }) {
      try {
        const result = await salesService.getTypes();
        commit("setSalesTypes", result);
        return result;
      } catch (error) {
        console.log(error);
      }
    },

    async fetchAllSmi({ commit }) {
      try {
        const result = await salesService.getSmi();
        commit("setSmi", result);
        return result;
      } catch (error) {
        console.log(error);
      }
    },
  },
};

export default sales;
