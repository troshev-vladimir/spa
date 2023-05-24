import AxiosInstance from "../index";

class EventService {
  constructor() {
    this.axios = AxiosInstance;
  }

  async getAll(departmentId = 1, query) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    params["department_id"] = departmentId;

    if (query) {
      Object.assign(params, query);
    }
    const { data } = await this.axios("/v1/events", {
      params,
    });
    return data;
  }

  async getAllArchive(departmentId = 1, query) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    params["department_id"] = departmentId;

    if (query) {
      Object.assign(params, query);
    }
    const { data } = await this.axios("/v1/events/archive", {
      params,
    });
    return data;
  }

  async getOne(id) {
    const response = await this.axios("/v1/events/" + id);
    return response.data;
  }

  async getOneByClientId(id) {
    const response = await this.axios("/v1/events/by-client/" + id);
    return response.data;
  }

  async delete(id) {
    const response = await this.axios.delete("/v1/events/" + id);

    return response.data;
  }

  async update(id, body) {
    const response = await this.axios.put("/v1/events/" + id, body);

    return response.data;
  }

  async accomplish(id, body) {
    const response = await this.axios.post("/v1/events/" + id + "/accomplish", body);

    return response.data;
  }

  async reschedule(id, body) {
    const response = await this.axios.post("/v1/events/" + id + "/reschedule", body);

    return response.data;
  }

  async create(body) {
    let response;
    try {
      response = await this.axios.post("/v1/events/", body);
    } catch (error) {
      throw error.response.data;
    }

    return response.data;
  }

  async getAllTypes() {
    let response;

    try {
      response = await this.axios.get("/v1/event-types/");
      return response.data;
    } catch (error) {
      return response.message;
    }
  }

  async moveToArchive(id) {
    let response;
    try {
      response = await this.axios.post("/v1/events/" + id + "/archive");
    } catch (error) {
      return response.message;
    }

    return response.data;
  }
}

export default new EventService();
