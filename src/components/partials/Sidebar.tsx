import React from "react";
import { Nav } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { getStaticResourceUrl } from "./../../utilities/getStaticResource";
import AuthResponse from "../../apis/auth/auth/responses/auth.response";

interface Route {
  path: string;
  title: string;
}

interface Auth {
  avatar?: string;
  username: string;
}

const routes: Route[] = [
  {
    path: "/users",
    title: "Quản lý người dùng",
  },
  {
    path: "/products",
    title: "Quản lý sản phẩm",
  },
  {
    path: "/orders",
    title: "Quản lý đơn hàng",
  },
  {
    path: "/contacts",
    title: "Quản lý liên hệ",
  },
];

interface AdminMenuProps {
  auth?: AuthResponse;
}

function Sidebar(props: AdminMenuProps) {
  const location = useLocation();
  const pathname = location.pathname;
  console.log("auth", props.auth);

  return (
    <div className="bg-secondary p-1 pb-5">
      <div className="text-center">
        <img
          src={getStaticResourceUrl(props.auth?.avatar)}
          width="160px"
          alt={props.auth?.username}
        />
        <p className="text-white">{props.auth?.username}</p>
      </div>
      <Nav className="flex-column text-white nav-pills nav-fill">
        {routes.map((route, index) => {
          return (
            <Nav.Link
              key={index}
              className="border border-info text-white"
              as={Link}
              to={route.path}
              active={!!pathname.match("^" + route.path + ".*")}
            >
              {route.title}
            </Nav.Link>
          );
        })}
      </Nav>
    </div>
  );
}

export default Sidebar;
