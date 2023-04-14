import { createStore } from "vuex";
import userModule from "./modules/userModule.js";
import usersModule from "./modules/usersModule.js";
import clientsModule from "./modules/clientsModule.js";

export default createStore({
  state: {
    department: null,
  },
  getters: {},
  mutations: {
    setDepartment(state, value) {
      state.department = value;
    },
  },
  actions: {},
  modules: {
    user: userModule,
    users: usersModule,
    clients: clientsModule,
  },
});
