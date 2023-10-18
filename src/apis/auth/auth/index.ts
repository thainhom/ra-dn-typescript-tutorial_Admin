import { AxiosResponse } from "axios";

import axiosInstance from "../../base.api";
import { LoginRequest } from "./requests/login-request";
import { LoginResponse } from "./responses/login.response";
import AuthResponse from "./responses/auth.response";

const loginApi = async (requestBody: LoginRequest): Promise<LoginResponse> => {
  return axiosInstance
    .post("/login", requestBody)
    .then((response: AxiosResponse<LoginResponse>) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

const getAuthApi = async (): Promise<AuthResponse> => {
  return axiosInstance
    .get("/auth", {})
    .then((response: AxiosResponse<AuthResponse>) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export default { loginApi, getAuthApi };
