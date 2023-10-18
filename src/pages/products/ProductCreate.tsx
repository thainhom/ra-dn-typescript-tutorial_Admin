import React from "react";
import { useNavigate } from "react-router-dom";

import ProductsForm from "../../components/form/ProductForm";
import productApi from "../../apis/product.api";

function ProductCreate() {
  const navigate = useNavigate();

  const handleAdd = (product: FormData) => {
    productApi
      .createProduct(product)
      .then((response) => {
        navigate("/products");
      })
      .catch((error: any) => {
        if (error.response && error.response.status === 401) {
          alert(error.response.statusText);
          navigate("/login");
        } else {
          alert(
            error.response ? error.response.statusText : "An error occurred."
          );
        }
      });
  };

  return (
    <>
      <h1>Thêm mới sản phẩm</h1>
      <ProductsForm
        onSubmit={handleAdd}
        onCancel={() => navigate("/products")}
      />
    </>
  );
}

export default ProductCreate;
