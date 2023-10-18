import React from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutAction } from "../../store/actions/auth.action";
import authApi from "../../apis/auth/auth";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();

    authApi
      .logout()
      .then((response) => {
        dispatch(logoutAction());
        navigate("/login");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      <Navbar expand="lg" className="bg-info border-bottom border-secondary">
        <Container>
          <Navbar.Brand as={Link} to="/">
            Trang quản trị viên
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse
            id="basic-navbar-nav"
            className="justify-content-end"
          >
            <Nav className="float-end">
              <NavDropdown title="Thông tin tài khoản" id="basic-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">
                  Thông tin tài khoản
                </NavDropdown.Item>
                <NavDropdown.Item href="#" onClick={handleLogout}>
                  Đăng xuất
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
