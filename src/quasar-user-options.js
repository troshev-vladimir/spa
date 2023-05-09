import "./styles/quasar.scss";
import iconSet from "quasar/icon-set/fontawesome-v6.js";
import "@quasar/extras/fontawesome-v6/fontawesome-v6.css";
import { Notify, Dialog } from "quasar";
export default {
  plugins: { Notify, Dialog },
  config: {
    notify: {
      position: "top",
    },
  },
  iconSet: iconSet,
};
