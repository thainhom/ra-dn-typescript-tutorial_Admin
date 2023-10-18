import React, { useState, useEffect } from "react";
import moment from "moment/moment";
import { Table, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import productApi from "../../apis/product.api";
import AdminPaginationComponent, {
  NUMBER_RECORDS_PER_PAGE,
} from "../../components/table/Pagination";
import { Product } from "../../apis/product.api";
interface ProductDataResponse {
  records: Product[];
  total: number;
}
function ProductList() {
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [searchInputValue, setSearchInputValue] = useState<string>("");
  const [keyword, setKeyword] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);

  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);

  const fetchProducts = () => {
    productApi
      .searchProducts({
        name: keyword,
        page: page,
        limit: NUMBER_RECORDS_PER_PAGE,
      })
      .then((data) => {
        if ("records" in data && "total" in data) {
          const userDataResponse = data as ProductDataResponse;
          setProducts(userDataResponse.records);
          setTotal(userDataResponse.total);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          alert(error.response.statusText);
          navigate("/login");
        } else {
          alert("Lỗi: " + error.message);
        }
      });

    setSelectedProductIds([]);
  };

  useEffect(() => {
    fetchProducts();
  }, [keyword, page]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setKeyword(searchInputValue);
  };

  const handleAdd = () => {
    navigate("/products/new");
  };

  const handleEdit = (id: number) => {
    navigate(`/products/${id}/edit`);
  };

  const handleBulkDelete = () => {
    const selectedSKUs = products
      .filter((product) => selectedProductIds.includes(product.product_id))
      .map((product) => product.sku);
    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa sản phẩm [${selectedSKUs}] không ?`
      )
    ) {
      // TODO
      fetchProducts();
    }
  };

  const handleDelete = (id: number, sku: string) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm ${sku} không ?`)) {
      productApi
        .deleteProduct(id)
        .then(() => {
          fetchProducts();
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            alert(error.response.statusText);
            navigate("/login");
          } else {
            alert("Lỗi: " + error.message);
          }
        });
    }
  };

  const changeProductCheckbox = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const productId = parseInt(event.target.value, 10);
    if (event.target.checked) {
      setSelectedProductIds([...selectedProductIds, productId]);
    } else {
      const newSelectedProductIds = selectedProductIds.filter(
        (selectedProductId) => selectedProductId !== productId
      );
      setSelectedProductIds(newSelectedProductIds);
    }
  };

  const selectAllProductCheckboxes = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      const productIds = products.map((product) => product.product_id);
      setSelectedProductIds(productIds);
    } else {
      setSelectedProductIds([]);
    }
  };

  const isSelectedAllProduct =
    selectedProductIds.length !== 0 &&
    selectedProductIds.length === products.length;

  return (
    <>
      <h1>Danh sách sản phẩm</h1>
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
          {selectedProductIds.length !== 0 && (
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
                onChange={selectAllProductCheckboxes}
                checked={isSelectedAllProduct}
              />
            </th>
            <th>Mã sản phẩm</th>
            <th>Tên sản phẩm</th>
            <th>Phân loại sản phẩm</th>
            <th>Giá tiền</th>
            <th>Mô tả sản phẩm</th>
            <th>Thời gian tạo</th>
            <th>Thời gian cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td>
                <Form.Check
                  type="checkbox"
                  name="product_id"
                  id={"product_id-" + product.product_id}
                  value={product.product_id}
                  onChange={changeProductCheckbox}
                  checked={selectedProductIds.includes(product.product_id)}
                />
              </td>
              <td>{product.sku}</td>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>{product.unit_price}</td>
              <td>{product.description}</td>
              <td>{moment(product.created_at).format("YYYY-MM-DD HH:mm")}</td>
              <td>{moment(product.updated_at).format("YYYY-MM-DD HH:mm")}</td>
              <td>
                <Button
                  variant="warning"
                  className="m-1"
                  onClick={() => handleEdit(product.product_id)}
                >
                  Sửa
                </Button>
                <Button
                  variant="danger"
                  className="m-1"
                  onClick={() => handleDelete(product.product_id, product.sku)}
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

export default ProductList;
