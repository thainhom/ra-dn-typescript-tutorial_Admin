import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import OrderForm from "../../components/form/OrderForm";
import orderApi, { Order, OrderDetail } from "../../apis/order.api";

function OrderEdit() {
  const [orderDetail, setOrderDetail] = useState<OrderDetail[]>([]);

  const navigate = useNavigate();
  const { id } = useParams();

  const getEffect = () => {
    if (id) {
      orderApi
        .getOrderByOrderId(id)
        .then((order: Order) => {
          setOrderDetail(order.order_details);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            alert(error.response.statusText);
            navigate("/login");
          } else {
            alert(
              error.response ? error.response.statusText : "Error occurred"
            );
          }
        });
    }
  };

  useEffect(() => {
    getEffect();
  }, [id]);

  const handleUpdate = (order: any) => {
    if (id) {
      orderApi
        .updateOrder(id, order)
        .then(() => {
          navigate("/orders");
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            alert(error.response.statusText);
            navigate("/login");
          } else {
            alert(
              error.response ? error.response.statusText : "Error occurred"
            );
          }
        });
    }
  };

  const handleDeleteOrderDetail = (order_detail_id: string) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa đơn hàng ${order_detail_id} không ?`
      )
    ) {
      orderApi
        .deleteOrderDetail(order_detail_id)
        .then(() => {
          getEffect();
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            alert(error.response.statusText);
            navigate("/login");
          } else {
            alert(
              error.response ? error.response.statusText : "Error occurred"
            );
          }
        });
    }
  };

  return (
    <>
      <h1>Chỉnh sửa thông tin đơn hàng</h1>
      <OrderForm
        orderId={id}
        onSubmit={handleUpdate}
        onCancel={() => navigate("/orders")}
      />
      <h2>Chi tiết đơn hàng</h2>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>ID người đặt hàng</th>
            <th>Id chi tiết đặt hàng</th>
            <th>Mã sản phẩm</th>
            <th>Tên sản phẩm</th>
            <th>Số lượng</th>
            <th>Đơn giá</th>
            <th>Tổng giá trên sản phẩm</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orderDetail.map((item, index) => {
            return (
              <tr key={index}>
                <td>{item.order_id}</td>
                <td>{item.order_detail_id}</td>
                <td>{item.sku}</td>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.unit_price}</td>
                <td>{item.sub_total_price}</td>
                <td>
                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteOrderDetail(item.order_detail_id)
                    }
                    className="btn btn-danger m-1"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
}

export default OrderEdit;
