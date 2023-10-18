import React from "react";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";

import ProductsForm from "../../components/form/ProductForm";

import productApi from "../../apis/product.api";

function ProductEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>() as { id: string };
  const handleUpdate = (product: FormData) => {
    productApi
      .updateProduct(id, product)
      .then(() => {
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
      <h1 >Chỉnh sửa thông tin sản phẩm</h1>
      <ProductsForm
        productId={id}
        onSubmit={handleUpdate}
        onCancel={() => navigate("/products")}
      />
    </>
  );
}

export default ProductEdit;
