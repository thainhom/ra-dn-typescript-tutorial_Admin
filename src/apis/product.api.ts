import api from "./base.api";
import { AxiosResponse } from "axios";

export interface Product {
  product_id: number;
  sku: string;
  name: string;
  category: string;
  unit_price: number;
  description: string;
  image: File | null;
  created_at: string;
  updated_at: string;
}

const searchProducts = async (
  params: Record<string, any> = {}
): Promise<Product[]> => {
  try {
    const response: AxiosResponse<Product[]> = await api.get("/products", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const createProduct = async (requestBody: any): Promise<Product> => {
  try {
    const response: AxiosResponse<Product> = await api.postForm(
      "/products",
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const getProductByProductId = async (productId: number): Promise<Product> => {
  try {
    const response: AxiosResponse<Product> = await api.get(
      `/products/${productId}`
    );
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const updateProduct = async (
  productId: string,
  requestBody?: FormData
): Promise<Product> => {
  try {
    console.log("requestBody", requestBody);
    const response: AxiosResponse<Product> = await api.putForm(
      `/products/${productId}`,
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const deleteProduct = async (productId: number): Promise<void> => {
  try {
    await api.delete(`/products/${productId}`);
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};
export default {
  searchProducts,
  createProduct,
  getProductByProductId,
  updateProduct,
  deleteProduct,
};
