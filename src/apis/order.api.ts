import api from "./base.api";
import { AxiosResponse } from "axios";

export interface Order {
  serial_number: string;
  user_id: string;
  total_price: string | number;
  status: number;
  note: string;
  username: string;
  order_details: OrderDetail[];
}

export interface OrderDetail {
  order_id: string;
  order_detail_id: string;
  sku: string;
  name: string;
  quantity: number;
  unit_price: number;
  sub_total_price: number;
}

const searchOrders = async (
  params: Record<string, any> = {}
): Promise<Order[]> => {
  try {
    const response: AxiosResponse<Order[]> = await api.get("/orders", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const createOrder = async (requestBody?: any): Promise<Order> => {
  try {
    const response: AxiosResponse<Order> = await api.post(
      "/orders",
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const getOrderByOrderId = async (orderId: string): Promise<Order> => {
  try {
    const response: AxiosResponse<Order> = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const updateOrder = async (
  orderId: string,
  requestBody: any
): Promise<Order> => {
  try {
    const response: AxiosResponse<Order> = await api.put(
      `/orders/${orderId}`,
      requestBody
    );
    return response.data;
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const deleteOrder = async (orderId: string): Promise<void> => {
  try {
    await api.delete(`/orders/${orderId}`);
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};

const deleteOrderDetail = async (orderDetailId: string): Promise<void> => {
  try {
    await api.delete(`/order-details/${orderDetailId}`);
  } catch (error) {
    console.error("API Error", error);
    throw error;
  }
};
export default {
  searchOrders,
  createOrder,
  getOrderByOrderId,
  updateOrder,
  deleteOrder,
  deleteOrderDetail,
};
