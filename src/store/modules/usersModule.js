import userService from "@/api/users";
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
      const result = await userService.getAll();
      commit("setUsers", result.data);
    },
  },
};

export default moduleB;
