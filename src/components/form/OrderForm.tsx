import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Form, Button } from "react-bootstrap";
import ResourceNotFound from "../errors/ResourceNotFound";
import orderApi from "../../apis/order.api";

export interface Order {
  serial_number: string;
  user_id: string;
  total_price: string | number;
  status: number;
  note: string;
  username: string;
}

interface OrderFormProps {
  orderId?: string;
  onSubmit: (order: Order) => void;
  onCancel: () => void;
}

function OrderForm({ orderId, onSubmit, onCancel }: OrderFormProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    setIsEdit(orderId !== undefined);

    if (orderId === undefined) {
      setOrder({
        serial_number: "",
        user_id: "",
        total_price: "",
        status: 0,
        note: "",
        username: "",
      });
    } else {
      orderApi
        .getOrderByOrderId(orderId)
        .then((response: Order) => {
          setOrder({
            ...response,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [orderId]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "total_price" || name === "status") {
      if (value === "" || !isNaN(parseFloat(value))) {
        setOrder((prevOrder) => {
          if (prevOrder) {
            return {
              ...prevOrder,
              [name]: value === "" ? "" : parseFloat(value),
            };
          }
          return prevOrder;
        });
      }
    } else {
      setOrder((prevOrder) => {
        if (prevOrder) {
          return {
            ...prevOrder,
            [name]: value,
          };
        }
        return prevOrder;
      });
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const validationErrors = validate();
    if (validationErrors.size === 0 && order) {
      onSubmit(order);
    } else {
      setErrors(validationErrors);
    }
  };

  const validate = () => {
    const validationErrors = new Map<string, string>();

    if (order && order.serial_number.length === 0) {
      validationErrors.set("serial_number", "Mã đơn hàng không được để trống");
    }

    if (order && !/^\d+(\.\d{0,2})?$/.test(order.total_price.toString())) {
      validationErrors.set(
        "total_price",
        "Giá tiền phải là một số hợp lệ, có tối đa 2 chữ số sau dấu thập phân."
      );
    }

    if (order && !/^\d+(\.\d{0,2})?$/.test(order.status.toString())) {
      validationErrors.set(
        "status",
        "Trạng thái đơn hàng là một số hợp lệ của admin đưa ra  "
      );
    }

    if (order && order.note.length > 100) {
      validationErrors.set("note", "Bạn đã ghi chú quá giới hạn cho phép ");
    }

    return validationErrors;
  };

  return (
    <>
      {order ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>
              Mã đơn hàng <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="serial_number"
              value={order.serial_number}
              onChange={handleChange}
              disabled={isEdit}
              isInvalid={!!errors.get("serial_number")}
            />
            <Form.Text className="text-danger">
              {errors.get("serial_number")}
            </Form.Text>
          </Form.Group>

          {/* ... (các phần còn lại của form) */}

          <Form.Group className="mb-3 float-end ">
            <Button
              type="button"
              variant="secondary"
              className="m-1"
              onClick={onCancel}
            >
              Hủy
            </Button>
            <Button type="submit" variant="success" className="m-1">
              Lưu
            </Button>
          </Form.Group>
        </Form>
      ) : (
        <ResourceNotFound resourceName="Đơn hàng" />
      )}
    </>
  );
}

export default OrderForm;
