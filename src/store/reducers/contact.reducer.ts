import { createReducer } from "@reduxjs/toolkit";
import moment from "moment/moment";

// Định nghĩa kiểu dữ liệu cho state danh bạ liên lạc
interface ContactState {
  contacts: object[];
}

// Khởi tạo state ban đầu
const initialContacts: object[] = [];

// Khởi tạo reducer cho danh bạ liên lạc
const contactsReducer = createReducer<ContactState>(
  { contacts: initialContacts },
  {}
);

export default contactsReducer;
