import axiosInstanse from "@/api";

const moduleB = {
  namespaced: true,

  state: () => ({
    usersData: [],
  }),
  mutations: {
    registerUser(state, user) {
      const users = state.usersData;
      const id = users[users.length - 1].id + 1;
      state.usersData.push({ ...user, id, balance: 0, status: true });
    },
    setUsers(state, arr) {
      console.log(arr);
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
