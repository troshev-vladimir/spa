import AxiosInstance from "../index";
class ClientService {
  constructor() {
    this.axios = AxiosInstance;
  }

  async getAll() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const response = await this.axios("/v1/clients", { params });
    return response.data;
  }

  async getAllByDepartment(departmentID) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());

    const response = await this.axios(
      `/v1/clients/department/${departmentID}`,
      { params }
    );
    return response.data;
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
}

export default new ClientService();
