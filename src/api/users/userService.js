import AxiosInstance from "../index";
class UserService {
  constructor() {
    this.axios = AxiosInstance;
  }

  async getAll() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const response = await this.axios("/v1/users", { params });
    return response.data;
  }

  async getOne(id) {
    const response = await this.axios("/v1/users/" + id);
    return response.data;
  }

  async delete(id) {
    const response = await this.axios.delete("/v1/users/" + id);

    return response.data;
  }

  async update(id, body) {
    const response = await this.axios.put("/v1/users/" + id, body);

    return response.data;
  }
}

export default new UserService();
