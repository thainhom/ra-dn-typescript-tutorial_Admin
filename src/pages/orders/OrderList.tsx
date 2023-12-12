import React, { useEffect, useState } from "react";
import { Table, Form, Badge, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import orderApi from "../../apis/order.api";
import AdminPaginationComponent, {
  NUMBER_RECORDS_PER_PAGE,
} from "../../components/table/Pagination";

const formatStatus = (status: number) => {
  if (status === 1) {
    return <Badge bg="warning">Đơn hàng mới</Badge>;
  } else if (status === 2) {
    return <Badge bg="secondary">Đã xác thực</Badge>;
  } else if (status === 3) {
    return <Badge bg="info">Đang giao hàng</Badge>;
  } else if (status === 4) {
    return <Badge bg="success">Đã hoàn thành</Badge>;
  } else if (status === 5) {
    return <Badge bg="primary">Đã thanh toán</Badge>;
  } else if (status === 6) {
    return <Badge bg="dark">Hoàn tất</Badge>;
  } else if (status === 7) {
    return <Badge bg="danger">Bị từ chối</Badge>;
  }
};
interface ApiResponse {
  records: Order[];
  total: number;
}
interface Order {
  serial_number: string;
  user_id: string;
  total_price: string | number;
  status: number;
  note: string;
  username: string;
  order_at: string;
  order_id: any;
  created_at: string;
  updated_at: string;
}

function OrderList() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [searchInputValue, setSearchInputValue] = useState("");
  const [keyword, setKeyword] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selectOrderId, setSelectOrderId] = useState<number[]>([]);

  const fetchOrders = () => {
    orderApi
      .searchOrders({
        keyword: keyword,
        page: page,
        limit: NUMBER_RECORDS_PER_PAGE,
      })
      .then((data) => {
        if ("records" in data && "total" in data) {
          const userDataResponse = data as ApiResponse;
          setOrders(userDataResponse.records);
          setTotal(userDataResponse.total);
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          alert(error.response.statusText);
          navigate("/login");
        } else {
          alert(error.response.statusText);
        }
      });

    setSelectOrderId([]);
  };

  useEffect(() => {
    fetchOrders();
  }, [keyword, page]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setKeyword(searchInputValue);
  };

  const handleAdd = () => {
    navigate("/orders/new");
  };

  const handleEdit = (id: string) => {
    navigate(`/orders/${id}/edit`);
  };

  const handleBulkDelete = () => {
    const serial_numbers = orders
      .filter((order) => !!selectOrderId.includes(order.order_id))
      .map((order) => order.serial_number);

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa đơn hàng [${serial_numbers}] không ?`
      )
    ) {
      // TODO: Xử lý xóa
      fetchOrders();
    }
  };

  const handleDelete = (id: string, serial_number: string) => {
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa đơn hàng ${serial_number} không ?`
      )
    ) {
      orderApi
        .deleteOrder(id)
        .then(() => {
          fetchOrders();
        })
        .catch((error) => {
          if (error.response.status === 401) {
            alert(error.response.statusText);
            navigate("/login");
          } else {
            alert(error.response.statusText);
          }
        });
    }
  };

  const changeOrderIdCheckbox = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      setSelectOrderId((prevSelectOrderId) => [
        ...prevSelectOrderId,
        parseInt(event.target.value, 10),
      ]);
    } else {
      setSelectOrderId((prevSelectOrderId) =>
        prevSelectOrderId.filter(
          (selectedOrderId) =>
            selectedOrderId !== parseInt(event.target.value, 10)
        )
      );
    }
  };

  const selectAllOrderIdCheckboxes = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      const orderIdArray = orders.map((order) => order.order_id);
      setSelectOrderId(orderIdArray);
    } else {
      setSelectOrderId([]);
    }
  };

  const isSelectedAllOrderId =
    selectOrderId.length !== 0 && selectOrderId.length === orders.length;

  return (
    <>
      <h1>Danh sách đơn hàng</h1>
      <Form className="row m-1 mb-3" onSubmit={handleSearch}>
        <div className="col-8">
          <Form.Control
            type="text"
            value={searchInputValue}
            onChange={(event) => setSearchInputValue(event.target.value)}
            placeholder="Nhập từ khóa"
          />
        </div>
        <div className="col-4">
          <Button type="submit" variant="info mx-1">
            Tìm kiếm
          </Button>
          <Button type="button" variant="primary mx-1" onClick={handleAdd}>
            Thêm mới
          </Button>
          {selectOrderId.length !== 0 && (
            <Button
              type="button"
              variant="danger mx-1"
              onClick={handleBulkDelete}
            >
              Xóa
            </Button>
          )}
        </div>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>
              <Form.Check
                type="checkbox"
                onChange={selectAllOrderIdCheckboxes}
                checked={isSelectedAllOrderId}
              />
            </th>
            <th>Mã đơn hàng</th>
            <th>Tên người đặt</th>
            <th>Thời gian đặt hàng</th>
            <th>Tổng giá đơn hàng</th>
            <th>Trạng thái đặt hàng</th>
            <th>Ghi chú</th>
            <th>Thời gian tạo đơn hàng</th>
            <th>Thời gian cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.order_id}>
              <td>
                <Form.Check
                  type="checkbox"
                  name="order_id"
                  id={"order_id-" + order.order_id}
                  value={order.order_id}
                  onChange={changeOrderIdCheckbox}
                  checked={selectOrderId.includes(order.order_id)}
                />
              </td>
              <td>{order.serial_number}</td>
              <td>{order.username}</td>
              <td>{moment(order.order_at).format("YYYY-MM-DD HH:mm")}</td>
              <td>{order.total_price}</td>
              <td>{formatStatus(order.status)}</td>
              <td>{order.note}</td>
              <td>{moment(order.created_at).format("YYYY-MM-DD HH:mm")}</td>
              <td>{moment(order.updated_at).format("YYYY-MM-DD HH:mm")}</td>
              <td>
                <Button
                  variant="warning"
                  className="m-1"
                  onClick={() => handleEdit(order.order_id)}
                >
                  Sửa
                </Button>
                <Button
                  variant="danger"
                  className="m-1"
                  onClick={() =>
                    handleDelete(order.order_id, order.serial_number)
                  }
                >
                  Xóa
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <AdminPaginationComponent total={total} setPage={setPage} />
    </>
  );
}

export default OrderList;
