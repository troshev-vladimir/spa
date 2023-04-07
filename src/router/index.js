import { createRouter, createWebHistory } from "vue-router";
// import store from "../store/index.js";

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
    component: () => import("../views/UsersView.js/UsersView.vue"),
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
    ],
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

// router.beforeEach((to, from, next) => {
//   if (to.name !== "auth" && !store.state.user.isAuth) {
//     next({
//       path: "/auth",
//     });
//   } else next();
// });

export default router;
