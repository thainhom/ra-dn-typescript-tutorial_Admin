import { createReducer } from "@reduxjs/toolkit";

// Định nghĩa kiểu dữ liệu cho state đơn hàng
interface OrderState {
  orders: object[];
}

// Khởi tạo state ban đầu
const initialOrders: object[] = [];

// Khởi tạo reducer cho đơn hàng
const orderReducer = createReducer<OrderState>({ orders: initialOrders }, {});

export default orderReducer;
