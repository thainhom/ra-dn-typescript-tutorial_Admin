import { createAction } from "@reduxjs/toolkit";
import moment from "moment/moment";
import getNextId from "../../utilities/getNextId";

// Định nghĩa kiểu dữ liệu cho các action danh bạ liên lạc
interface Contact {
  id: number;
  // Thêm các trường dữ liệu khác của danh bạ liên lạc
}

interface AddContactAction {
  type: 'ADD_CONTACT';
  payload: Contact;
}

interface EditContactAction {
  type: 'UPDATE_CONTACT';
  payload: Contact;
}

interface DeleteContactAction {
  type: 'DELETE_CONTACT';
  payload: { id: number };
}

// Định nghĩa các action sử dụng kiểu dữ liệu đã định nghĩa
const addContact = createAction<AddContactAction>('ADD_CONTACT');
const editContact = createAction<EditContactAction>('UPDATE_CONTACT');
const deleteContact = createAction<DeleteContactAction>('DELETE_CONTACT');

export {
  addContact,
  editContact,
  deleteContact,
};
