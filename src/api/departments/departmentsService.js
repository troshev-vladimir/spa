import AxiosInstance from "../index";
class departmentsService {
  constructor() {
    this.axios = AxiosInstance;
  }

  async getAll() {
    const { data } = await this.axios.get("/v1/departments/");
    return data.data;
  }

  async getByUser(userId) {
    const { data } = await this.axios.get("/v1/departments/" + userId);
    return data.data;
  }

  async attachToUser(departmentId, userId) {
    try {
      const { data } = await this.axios.post("/v1/departments/" + departmentId, { userId });
      return data;
    } catch (error) {
      console.log(error);
      throw error.response.data.message;
    }
  }

  async detachFromUser(departmentId, userId) {
    try {
      const { data } = await this.axios.put("/v1/departments/" + departmentId, { userId });
      return data;
    } catch (error) {
      console.log(error);
      throw error.response.data.message;
    }
  }
}

export default new departmentsService();
