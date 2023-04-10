import AxiosInstance from "../index";
class departmentsService {
  constructor() {
    this.axios = AxiosInstance;
  }

  async getAll() {
    const response = await this.axios.get("/v1/departments/");
    return response.data.data;
  }
}

export default new departmentsService();
