import axiosInstanse from "@/api";

const moduleB = {
  namespaced: true,

  state: () => ({
    usersData: [],
  }),
  mutations: {
    setUsers(state, arr) {
      state.usersData = arr;
    },
  },
  actions: {
    async fetchAllUsers({ commit }) {
      const result = await axiosInstanse.get("/v1/users/");
      commit("setUsers", result.data);
    },
  },
};

export default moduleB;
