import AxiosInstance from "../index";
class UserService {
  constructor() {
    this.axios = AxiosInstance;
  }

  getAll() {
    return this.axios("/v1/users");
  }
}

export default new UserService();
