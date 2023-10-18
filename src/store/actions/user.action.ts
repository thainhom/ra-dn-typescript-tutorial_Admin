import { createAction } from "@reduxjs/toolkit";
import moment from "moment/moment";
// import getNextId from "../../utilities/getNextId";

// Định nghĩa kiểu dữ liệu cho các action
interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  role: number;
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number;
}

interface AddUserAction {
  type: 'ADD_USER';
  payload: User;
}

interface UpdateUserAction {
  type: 'UPDATE_USER';
  payload: User;
}

interface DeleteUserAction {
  type: 'DELETE_USER';
  payload: { id: number };
}

// Định nghĩa các action sử dụng kiểu dữ liệu đã định nghĩa
const addUser = createAction<AddUserAction>('ADD_USER');
const updateUser = createAction<UpdateUserAction>('UPDATE_USER');
const deleteUser = createAction<DeleteUserAction>('DELETE_USER');

export {
  addUser,
  updateUser,
  deleteUser,
};
