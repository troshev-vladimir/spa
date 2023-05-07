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
    try {
      const { data } = await this.axios.post("/v1/roles/" + roleId, {
        userId: userId,
      });
      return data;
    } catch (error) {
      console.log(error);
      throw error.response.data.message;
    }
  }

  async detachRole(roleId, userId) {
    try {
      const { data } = await this.axios.put("/v1/roles/" + roleId, {
        userId: userId,
      });
      return data;
    } catch (error) {
      console.log(error);
      throw error.response.data.message;
    }
  }
}

export default new AuthService();
