import { useDispatch } from "react-redux";
import { Button, Form, Row, Col } from "react-bootstrap";
import { AppDispatch } from "../store";
import { loginAction } from "../store/actions/auth.action";
import { useNavigate } from "react-router-dom";
import authApi from "../apis/auth/auth";
import { useState } from "react";

interface FormData {
  username: string;
  password: string;
  type: string;
}

function LoginPage() {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    type: "admin",
  });
  const [errors, setErrors] = useState(new Map<string, string>());

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    validate();
    if (errors.size === 0) {
      authApi
        .login(formData.username, formData.password, "admin")
        .then((response: any) => {
          dispatch(loginAction(response.token));
          navigate("/");
        })
        .catch((error: any) => {
          alert(error.response.statusText);
        });
    }
  };

  const validate = (): void => {
    const newErrors = new Map<string, string>();

    if (!formData.username) {
      newErrors.set("username", "Bắt buộc phải nhập");
    }
    if (!formData.password) {
      newErrors.set("password", "Bắt buộc phải nhập");
    }

    setErrors(newErrors);
  };

  return (
    <>
      <Row>
        <Col md={4}></Col>
        <Col md={4}>
          <h1 className="text-center my-5 ">Đăng nhập quản trị viên</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Tên đăng nhập</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tên đăng nhập"
                name="username"
                value={formData.username}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(event)
                }
              />
              {errors.get("username") && (
                <div className="text-danger">{errors.get("username")}</div>
              )}
            </Form.Group>
            <Form.Group className="mb-3 ">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control
                type="password"
                placeholder="Mật khẩu"
                name="password"
                value={formData.password}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange(event)
                }
              />
              {errors.get("password") && (
                <div className="text-danger">{errors.get("password")}</div>
              )}
            </Form.Group>
            <Form.Group className="mb-3 text-center">
              <Button type="submit" variant="primary">
                Đăng nhập
              </Button>
            </Form.Group>
          </Form>
        </Col>
        <Col md={4}></Col>
      </Row>
    </>
  );
}

export default LoginPage;
