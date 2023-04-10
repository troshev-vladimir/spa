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
      try {
        const result = await userService.getAll();
        commit("setUsers", result);
      } catch (error) {
        console.log(error);
      }
    },
  },
};

export default moduleB;
