import React from "react";
import { useNavigate } from "react-router-dom";
import OrderForm from "../../components/form/OrderForm";
import orderApi from "../../apis/order.api";

function OrderCreate() {
  const navigate = useNavigate();

  const handleAdd = (order: any) => {
    orderApi
      .createOrder(order)
      .then((response) => {
        navigate("/orders");
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          alert(error.response.statusText);
          navigate("/login");
        } else {
          alert(error.response ? error.response.statusText : "Error occurred");
        }
      });
  };

  return (
    <>
      <h1>Thêm mới đơn hàng</h1>
      <OrderForm onSubmit={handleAdd} onCancel={() => navigate("/orders")} />
    </>
  );
}

export default OrderCreate;
