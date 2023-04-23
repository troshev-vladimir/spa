import AxiosInstance from "../index";
class AuthService {
  constructor() {
    this.axios = AxiosInstance;
  }

  async login(data) {
    try {
      const res = await this.axios.post("/v1/login/", data, {
        skipAuth: true,
      });
      storeTokenInLS(res);
      return res.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async registration(data) {
    const response = await this.axios.post("/v1/register/", data);

    storeTokenInLS(response);

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

    storeTokenInLS(response);
  }
}

function storeTokenInLS(response) {
  const token = response.data.authorisation.token;
  localStorage.setItem("accessToken", token);
}

export default new AuthService();
