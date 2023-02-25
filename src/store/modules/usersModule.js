const moduleB = {
  namespaced: true,

  state: () => ({
    usersData: [
      {
        id: 0,
        name: "test",
        password: "test", // тут пароль только для имитации авторизации
        phone: "+7 (231) 22 23 321",
        balance: 33,
        status: true,
      },
      {
        id: 1,
        name: "vova",
        password: "test",
        phone: "+7 (221) 22 23 321",
        balance: 122,
        status: true,
      },
    ],
  }),
  mutations: {
    registerUser(state, user) {
      const users = state.usersData;
      const id = users[users.length - 1].id + 1;
      state.usersData.push({ ...user, id, balance: 0, status: true });
    },
  },
  actions: {},
};

export default moduleB;
