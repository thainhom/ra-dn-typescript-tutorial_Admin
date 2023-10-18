import { createAction } from "@reduxjs/toolkit";
import moment from "moment/moment";
import getNextId from "../../utilities/getNextId";

// Định nghĩa kiểu dữ liệu cho các action sản phẩm
interface Product {
  id: number;
  name: string;
  price: number;
  // Thêm các trường dữ liệu khác của sản phẩm
}

interface AddProductAction {
  type: 'ADD_PRODUCT';
  payload: Product;
}

interface UpdateProductAction {
  type: 'UPDATE_PRODUCT';
  payload: Product;
}

interface DeleteProductAction {
  type: 'DELETE_PRODUCT';
  payload: { id: number };
}

// Định nghĩa các action sử dụng kiểu dữ liệu đã định nghĩa
const addProduct = createAction<AddProductAction>('ADD_PRODUCT');
const updateProduct = createAction<UpdateProductAction>('UPDATE_PRODUCT');
const deleteProduct = createAction<DeleteProductAction>('DELETE_PRODUCT');

export {
  addProduct,
  updateProduct,
  deleteProduct,
};
