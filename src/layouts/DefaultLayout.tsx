import { Outlet } from "react-router-dom";

import { Container, Col, Row } from "react-bootstrap";

import Header from "../components/partials/Header";
import Footer from "../components/partials/Footer";
import Sidebar from "../components/partials/Sidebar";
import authApi from "../apis/auth/auth/index";
import { useEffect, useState } from "react";
import AuthResponse from "../apis/auth/auth/responses/auth.response";

function DefaultLayout() {
  const [auth, setAuth] = useState<AuthResponse | undefined>(undefined);

  useEffect(() => {
    authApi
      .getAuthApi()
      .then((response) => {
        setAuth(response);
      })
      .catch((error) => {
        alert(error);
      });
  }, []);

  return (
    <Container>
      <header>
        <Header />
      </header>
      <Row>
        <Col md={2}>
          <Sidebar auth={auth} />
        </Col>
        <Col md={10}>
          <div className="m-4">
            <Outlet />
          </div>
          <footer>
            <Footer />
          </footer>
        </Col>
      </Row>
    </Container>
  );
}

export default DefaultLayout;
