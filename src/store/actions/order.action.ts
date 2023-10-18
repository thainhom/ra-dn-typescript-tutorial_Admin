import { createAction } from "@reduxjs/toolkit";
import moment from "moment/moment";
import getNextId from "../../utilities/getNextId";

// Định nghĩa kiểu dữ liệu cho các action đơn hàng
interface Order {
  id: number;
  // Thêm các trường dữ liệu khác của đơn hàng
}

interface AddOrderAction {
  type: "ADD_ORDER";
  payload: Order;
}

interface UpdateOrderAction {
  type: "UPDATE_ORDER";
  payload: Order;
}

interface DeleteOrderAction {
  type: "DELETE_ORDER";
  payload: { id: number };
}

// Định nghĩa các action sử dụng kiểu dữ liệu đã định nghĩa
const addOrder = createAction<AddOrderAction>("ADD_ORDER");
const updateOrder = createAction<UpdateOrderAction>("UPDATE_ORDER");
const deleteOrder = createAction<DeleteOrderAction>("DELETE_ORDER");

export { addOrder, updateOrder, deleteOrder };
