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

let originalRequest = null;

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    originalRequest = err.config;
    console.log(err);

    const { data } = await instance.post("/v1/refresh/");
    localStorage.setItem("accessToken", data.authorisation.token);
    return instance(originalRequest);
  }
);
export default instance;
