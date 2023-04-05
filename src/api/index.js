import axios from "axios";
const token = "";
const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  headers: {
    common: {
      Authorization: "Bearer " + token,
      Accept: "application/json",
    },
  },
});

export default instance;
