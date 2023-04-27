import AxiosInstance from "../index";
class SalesService {
  constructor() {
    this.axios = AxiosInstance;
  }

  async getAll() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const { data } = await this.axios("/v1/sales", {
      params,
    });
    return data;
  }

  async getOne(id) {
    const response = await this.axios("/v1/sales/" + id);
    return response.data;
  }

  async getTypes() {
    const response = await this.axios("/v1/sales-types/");
    return response.data;
  }

  async getSmi() {
    const response = await this.axios("/v1/smi/");
    return response.data;
  }

  async delete(id) {
    const response = await this.axios.delete("/v1/sales/" + id);

    return response.data;
  }

  async update(id, body) {
    const response = await this.axios.put("/v1/sales/" + id, body);

    return response.data;
  }

  async create(body) {
    let response;
    try {
      response = await this.axios.post("/v1/sales/", body);
    } catch (error) {
      return response.message;
    }

    return response.data;
  }
}

export default new SalesService();
