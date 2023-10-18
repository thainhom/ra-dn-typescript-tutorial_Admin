import { createBrowserRouter, RouteObject } from "react-router-dom";
import { Router } from "@remix-run/router";

import DefaultLayout from "../layouts/DefaultLayout";

import DashboardPage from "../pages/DashboardPage";
import LoginPage from "../pages/LoginPage";
import UserList from "../pages/users/UserLists";
import UserEdit from "../pages/users/UserEdit";
import UserCreate from "../pages/users/UserCreate";
import ProductList from "../pages/products/ProductList";
import ProductEdit from "../pages/products/ProductEdit";
import ProductCreate from "../pages/products/ProductCreate";
import OrderList from "../pages/orders/OrderList";
import OrderEdit from "../pages/orders/OrderEdit";
import OrderCreate from "../pages/orders/OrderCreate";
import ContactList from "../pages/contacts/ContactList";
import ContactEdit from "../pages/contacts/ContactEdit";
import ContactCreate from "../pages/contacts/ContactCreate";

const routes: RouteObject[] = [
  {
    path: "/login",
    Component: LoginPage,
  },

  {
    id: "root",
    path: "/",
    Component: DefaultLayout,
    children: [
      {
        index: true,
        Component: DashboardPage,
      },
      {
        path: "/Users",
        Component: UserList,
      },
      {
        path: "users/:id/edit",
        Component: UserEdit,
      },
      {
        path: "users/new",
        Component: UserCreate,
      },
      {
        path: "/products",
        Component: ProductList,
      },
      {
        path: "products/:id/edit",
        Component: ProductEdit,
      },
      {
        path: "products/new",
        Component: ProductCreate,
      },
      {
        path: "/orders",
        Component: OrderList,
      },
      {
        path: "orders/:id/edit",
        Component: OrderEdit,
      },
      {
        path: "orders/new",
        Component: OrderCreate,
      },
      {
        path: "/contacts",
        Component: ContactList,
      },
      {
        path: "contacts/:id/edit",
        Component: ContactEdit,
      },
      {
        path: "contacts/new",
        Component: ContactCreate,
      },
    ],
  },
];

const router: Router = createBrowserRouter(routes);

export default router;
