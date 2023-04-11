import { createRouter, createWebHistory } from "vue-router";
import store from "../store/index.js";

const routes = [
  {
    path: "/auth",
    name: "auth",
    component: () => import("../views/AuthView/AuthView.vue"),
    meta: {
      layout: "EmptyLayout",
    },
  },
  {
    path: "/",
    name: "users",
    component: () => import("../views/UsersView/UsersView.vue"),
    meta: {
      layout: "DefaultLayout",
    },
  },
  {
    path: "/crm",
    name: "crm",
    component: () => import("../views/CrmView/"),
    meta: {
      layout: "DefaultLayout",
    },
    children: [
      {
        path: "reports",
        name: "reports",
        component: () => import("../views/ReportsView/"),
        children: [
          {
            path: "debt",
            name: "report-debt",
            component: () =>
              import("../components/ReportsTables/DebtTable.vue"),
          },
          {
            path: "",
            name: "report-summary",
            component: () =>
              import("../components/ReportsTables/SummaryTable.vue"),
          },
          {
            path: "calendar",
            name: "report-calendar",
            component: () =>
              import("../components/ReportsTables/CalendarTable.vue"),
          },
        ],
      },
      {
        path: "",
        name: "clients",
        component: () => import("../views/ClientsView"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  // console.log(store.state.user);
  if (to.name !== "auth" && !store.state.user) {
    next({
      path: "/auth",
    });
  } else next();
});

export default router;
