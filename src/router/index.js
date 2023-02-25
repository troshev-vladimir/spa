import { createRouter, createWebHistory } from "vue-router";
import store from "../store/index.js";

const routes = [
  {
    path: "/auth",
    name: "auth",
    component: () => import("../views/AuthView.vue"),
    meta: {
      layout: "EmptyLayout",
    },
  },
  {
    path: "/",
    name: "users",
    component: () => import("../views/UsersView.vue"),
    meta: {
      layout: "DefaultLayout",
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.name !== "auth" && !store.state.user.isAuth) {
    next({
      path: "/auth",
    });
  } else next();
});

export default router;
