import AxiosInstance from "../index";
class AuthService {
  constructor() {
    this.axios = AxiosInstance;
  }

  async login(data) {
    const response = await this.axios.post("/v1/login/", data, {
      skipAuth: true,
    });

    const token = response.data.authorisation.token;
    localStorage.setItem("accessToken", token);

    return response.data;
  }

  async registration(data) {
    const response = await this.axios.post("/v1/register/", data);

    const token = response.data.authorisation.token;
    localStorage.setItem("accessToken", token);

    return response.data;
  }

  async logout() {
    const response = await this.axios.post("/v1/logout/");
    localStorage.removeItem("accessToken");

    return response.data;
  }

  async refresh() {
    const response = await this.axios.post(
      "/v1/refresh/",
      {},
      {
        skipAuth: true,
      }
    );
    const token = response.data.authorisation.token;
    localStorage.setItem("accessToken", token);
  }
}

export default new AuthService();
