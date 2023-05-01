import { createApp } from "vue";
import App from "./App.vue";
import store from "./store";
import { Quasar } from "quasar";
import quasarUserOptions from "./quasar-user-options";
import router from "./router";

import axios from "axios";
import VueAxios from "vue-axios";

import DatePicker from "@/components/UiKit/DatePicker";

const app = createApp(App);

app.component("DatePicker", DatePicker);

app.use(router);
app.use(Quasar, quasarUserOptions);
app.use(store);
app.use(DatePicker);
app.use(VueAxios, axios);
app.mount("#app");
