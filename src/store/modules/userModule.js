import router from "@/router";

const moduleB = {
  namespaced: true,
  state: () => ({
    isAuth: false,
  }),
  mutations: {
    authorize(state) {
      state.isAuth = true;
    },
    unauthorize(state) {
      state.isAuth = false;
    },
  },
  actions: {
    exit(context) {
      context.commit("unauthorize");
      router.push({
        name: "auth",
      });
    },
  },
};

export default moduleB;
