import AxiosInstance from "../index";
class AuthService {
  constructor() {
    this.axios = AxiosInstance;
  }

  async login(data) {
    const response = await this.axios.post("/v1/login/", data);

    const token = response.data.authorisation.token;
    this.axios.defaults.headers.common["Authorization"] = "Beerer " + token;
    localStorage.setItem("accessToken", token);
    return response;
  }

  async registration(data) {
    const response = await this.axios.post("/v1/register/", data);

    const token = response.data.authorisation.token;
    this.axios.defaults.headers.common["Authorization"] = "Beerer " + token;
    localStorage.setItem("accessToken", token);
    return response;
  }
}

export default new AuthService();
