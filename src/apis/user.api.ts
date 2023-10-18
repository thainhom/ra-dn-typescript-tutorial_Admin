import api from "./base.api";
import { AxiosResponse } from "axios";

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: number;
  avatar: string;
  created_at: string;
  updated_at: string;
}

const searchUsers = async (
  params: Record<string, any> = {}
): Promise<User[]> => {
  try {
    const response: AxiosResponse<User[]> = await api.get("/users", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const createUser = async (requestBody: any): Promise<User> => {
  try {
    const response: AxiosResponse<User> = await api.postForm(
      "/users",
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const getUserByUserId = async (userId: number): Promise<User> => {
  try {
    const response: AxiosResponse<User> = await api.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const updateUser = async (
  userId?: string,
  requestBody?: FormData
): Promise<User> => {
  try {
    const response: AxiosResponse<User> = await api.putForm(
      `/users/${userId}`,
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const deleteUser = async (userId: number): Promise<void> => {
  try {
    await api.delete(`/users/${userId}`);
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

export default {
  searchUsers,
  createUser,
  getUserByUserId,
  updateUser,
  deleteUser,
};
