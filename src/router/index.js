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
    path: "/users",
    name: "users",
    component: () => import("../views/UsersView/UsersView.vue"),
    meta: {
      layout: "DefaultLayout",
    },
  },
  { path: "/", redirect: "/crm/clients" },
  {
    path: "/crm",
    name: "crm",
    component: () => import("../views/CrmView/"),
    meta: {
      layout: "DefaultLayout",
    },
    children: [
      {
        path: "",
        name: "clients",
        component: () => import("../views/ClientsView"),
      },
      {
        path: "clients",
        name: "clients",
        component: () => import("../views/ClientsView"),
      },
      {
        path: "events",
        name: "events",
        component: () => import("../views/EventsView"),
      },
      {
        path: "sales",
        name: "sales",
        component: () => import("../views/SalesView"),
      },
      {
        path: "incomes",
        name: "incomes",
        component: () => import("../views/IncomesView"),
      },
      {
        path: "reports",
        name: "reports",
        component: () => import("../views/ReportsView/"),
        children: [
          {
            path: "debt",
            name: "report-debt",
            component: () => import("../components/ReportsTables/DebtTable.vue"),
          },
          {
            path: "",
            name: "report-summary",
            component: () => import("../components/ReportsTables/SummaryTable.vue"),
          },
          {
            path: "calendar",
            name: "report-calendar",
            component: () => import("../components/ReportsTables/CalendarTable.vue"),
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

router.beforeEach((to, from, next) => {
  if (to.name !== "auth" && !store.state.user) {
    next({
      path: "/auth",
    });
  } else {
    if (to.name !== "auth") {
      localStorage.setItem("lastPath", to.name);
    }

    next();
  }
});

export default router;
