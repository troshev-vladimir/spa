import { createStore } from "vuex";
import userModule from "./modules/userModule.js";
import usersModule from "./modules/usersModule.js";
import clientsModule from "./modules/clientsModule.js";
import eventsModule from "./modules/eventsModule.js";
import salesModule from "./modules/salesModule.js";

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
    events: eventsModule,
    sales: salesModule,
  },
});
