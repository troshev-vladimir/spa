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
    if (config.skipAuth) {
      return config;
    }

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
let refreshTokenRequest = null;

instance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    let originalRequest = null;

    originalRequest = err.config;
    console.log(err);

    if (refreshTokenRequest === null) {
      refreshTokenRequest = instance.post("/v1/refresh/");
    }
    const { data } = await refreshTokenRequest;
    localStorage.setItem("accessToken", data.authorisation.token);
    refreshTokenRequest = null;
    return instance(originalRequest);
  }
);
export default instance;
