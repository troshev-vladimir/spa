import { createStore } from "vuex";
import userModule from "./modules/userModule.js";
import usersModule from "./modules/usersModule.js";

export default createStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user: userModule,
    users: usersModule,
  },
});
