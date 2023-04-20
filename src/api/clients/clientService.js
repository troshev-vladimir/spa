import AxiosInstance from "../index";
class ClientService {
  constructor() {
    this.axios = AxiosInstance;
  }

  async getAll(departmentId = 1) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    params["department_id"] = departmentId;
    const { data } = await this.axios("/v1/clients", {
      params,
    });
    return data.data;
  }

  async getOne(id) {
    const response = await this.axios("/v1/clients/" + id);
    return response.data;
  }

  async delete(id) {
    const response = await this.axios.delete("/v1/clients/" + id);

    return response.data;
  }

  async update(id, body) {
    const response = await this.axios.put("/v1/clients/" + id, body);

    return response.data;
  }

  async create(body) {
    let response;
    try {
      response = await this.axios.post("/v1/clients/", body);
    } catch (error) {
      return response.message;
    }

    return response.data;
  }
}

export default new ClientService();
