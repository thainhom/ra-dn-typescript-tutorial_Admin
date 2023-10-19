import api from "./../base.api";
import AuthResponse from "./auth/responses/auth.response";

interface LoginResponse {
  username: string;
  password: string;
  type: any;
}

const login = async (
  username: string,
  password: string,
  type: string
): Promise<LoginResponse> => {
  const requestBody = {
    username: username,
    password: password,
    type: type,
  };

  try {
    const response = await api.post("/login", requestBody);
    return response.data as LoginResponse;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const getAuth = async (): Promise<AuthResponse> => {
  try {
    const response = await api.get("/auth");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const logout = async (): Promise<void> => {
  try {
    await api.post("/logout", {});
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// interface RegisterResponse {
//   // Định nghĩa cấu trúc của dữ liệu phản hồi cho hàm register
//   // Điều chỉnh interface này dựa trên cấu trúc phản hồi thực tế của bạn
//   // Ở đây, tôi giả định rằng phản hồi có một trường 'data' kiểu bất kỳ
//   data: any;
// }

// const register = async (requestBody: any): Promise<RegisterResponse> => {
//   try {
//     const response = await api.post("/register", requestBody);
//     return response.data as RegisterResponse;
//   } catch (error) {
//     console.error(error);
//     throw error;
//   }
// };

export default {
  login,
  getAuth,
  logout,
};
