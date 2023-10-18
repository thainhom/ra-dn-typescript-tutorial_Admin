import { createReducer } from "@reduxjs/toolkit";

// Định nghĩa kiểu dữ liệu cho state sản phẩm
interface ProductState {
  products: object[];
}

// Khởi tạo state ban đầu
const initialProducts: object[] = [];

// Khởi tạo reducer cho sản phẩm
const productReducer = createReducer<ProductState>(
  { products: initialProducts },
  {}
);

export default productReducer;
