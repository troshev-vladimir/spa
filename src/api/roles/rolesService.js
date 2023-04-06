import AxiosInstance from "../index";
class AuthService {
  constructor() {
    this.axios = AxiosInstance;
  }

  async getAll() {
    const response = await this.axios.get("/v1/roles/");
    return response.data;
  }

  async attachRole(roleId, userId) {
    const response = await this.axios.post("/v1/roles/" + roleId, {
      userId: userId,
    });
    return response.data;
  }

  async detachRole(roleId, userId) {
    const response = await this.axios.put("/v1/roles/" + roleId, {
      userId: userId,
    });
    return response.data;
  }
}

export default new AuthService();
