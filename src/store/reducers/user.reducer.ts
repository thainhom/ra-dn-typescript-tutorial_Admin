import { createReducer } from "@reduxjs/toolkit";
import moment from "moment/moment";
import getNextId from "../../utilities/getNextId";
import { addUser, updateUser, deleteUser } from "../actions/user.action";

// Định nghĩa kiểu dữ liệu cho state
interface AppState {
  users: object[];
}

// Khởi tạo state ban đầu
const initialUsers: object[] = [];

// Khởi tạo reducer
const userProducer = createReducer<AppState>({ users: initialUsers }, {});

export default userProducer;
