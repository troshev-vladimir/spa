import axios from "axios";

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
    // Сделайте что-нибудь с ошибкой запроса
    return Promise.reject(error);
  }
);

export default instance;
