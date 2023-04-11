import AxiosInstance from "../index";
class departmentsService {
  constructor() {
    this.axios = AxiosInstance;
  }

  async getAll() {
    const { data } = await this.axios.get("/v1/departments/");
    return data.data;
  }
}

export default new departmentsService();
