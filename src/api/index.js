import axios from "axios";
import { useRouter } from "vue-router";
const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
  headers: {
    common: {
      Accept: "application/json",
    },
  },
});

instance.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("accessToken");
    config.headers.Authorization = "Bearer " + token;
    return config;
  },
  function (error) {
    const router = useRouter();
    console.log("error", error);
    router.push("auth");
  }
);

export default instance;
