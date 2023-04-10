import userService from "@/api/users";

const moduleB = {
  namespaced: true,
  state: () => ({
    user: {},
  }),
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    clearUser(state) {
      state.user = {};
    },
  },
  actions: {
    async getCurrentUser({ commit }) {
      const token = localStorage.getItem("accessToken");
      const pyload = parseJwt(token);

      try {
        const user = await userService.getOne(pyload?.sub);
        commit("setUser", user);
      } catch (error) {
        console.log(error);
      }
    },
  },
};
function parseJwt(token) {
  if (!token) return;
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );

  return JSON.parse(jsonPayload);
}

export default moduleB;
