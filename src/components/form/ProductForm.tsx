import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Form, Button } from "react-bootstrap";
import ResourceNotFound from "../errors/ResourceNotFound";
import productApi from "../../apis/product.api";

export interface Product {
  sku: string;
  name: string;
  category: string;
  unit_price: number;
  description: string;
  image: Blob | null;
}

interface ProductsFormProps {
  productId?: string;
  onSubmit: (formData: FormData) => void;
  onCancel: () => void;
}

const ProductsForm: React.FC<ProductsFormProps> = ({
  productId,
  onSubmit,
  onCancel,
}) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [product, setProduct] = useState<Product>({
    sku: "",
    name: "",
    category: "",
    unit_price: 0,
    description: "",
    image: null,
  });
  // const [formData, setFormData] = useState<FormData>(new FormData());
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    setIsEdit(!!productId);

    if (!productId) {
      setProduct({
        sku: "",
        name: "",
        category: "",
        unit_price: 0,
        description: "",
        image: null,
      });
    } else {
      productApi
        .getProductByProductId(Number(productId))
        .then((response: Product) => {
          // Xác định kiểu dữ liệu của response
          setProduct({
            ...response,
            category: response.category || "",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [productId]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const name = event.target.name;
    const target = event.target as HTMLInputElement;
    let value: string | File | null;

    if (target.type === "file") {
      const files = target.files;
      value = files ? files[0] : null;
    } else {
      value = target.value;
    }

    if (name === "unit_price") {
      if (value === "" || !isNaN(parseFloat(value as string))) {
        setProduct({
          ...product!,
          [name]: value === "" ? 0 : parseFloat(value as string),
        });
      }
    } else if (name === "image") {
      if (value instanceof File) {
        setProduct({
          ...product,
          [name]: (event.target as HTMLInputElement).files![0],
        });
        // formData.append("image", value);
      } else {
        setProduct({
          ...product,
          [name]: null,
        });
        // formData.delete("image");
      }
    } else {
      setProduct({
        ...product!,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("product", product);
    const formData = new FormData();
    const validationErrors = validate();
    if (validationErrors.size === 0) {
      formData.append("sku", product!.sku);
      formData.append("name", product!.name);
      formData.append("category", product!.category);
      formData.append("unit_price", product!.unit_price.toString());
      formData.append("description", product!.description);
      if (product.image) {
        formData.append("image", product.image);
      }
      console.log("formData", formData);
      onSubmit(formData);
    } else {
      setErrors(validationErrors);
    }
  };

  const validate = (): Map<string, string> => {
    const validationErrors = new Map<string, string>();

    if (product!.sku.length > 10) {
      validationErrors.set("sku", "Mã sản phẩm chỉ cho phép đến 10 ký tự.");
    } else if (product!.sku.length === 0) {
      validationErrors.set("sku", "Mã sản phẩm không được để trống");
    }

    if (product!.name.length < 4 || product!.name.length > 100) {
      validationErrors.set("name", "Tên sản phẩm bắt buộc từ 4 đến 100 ký tự.");
    } else if (product!.name.length === 0) {
      validationErrors.set("name", "Tên sản phẩm không được để trống");
    }

    if (product!.category.length > 20) {
      validationErrors.set(
        "category",
        "Phân loại sản phẩm chỉ được phép nhập nhỏ hơn 20 ký tự."
      );
    } else if (product!.category.length === 0) {
      validationErrors.set(
        "category",
        "Phân loại sản phẩm không được để trống"
      );
    }

    if (!/^\d+(\.\d{0,2})?$/.test(product!.unit_price.toString())) {
      validationErrors.set(
        "unit_price",
        "Giá tiền phải là một số hợp lệ, có tối đa 2 chữ số sau dấu thập phân."
      );
    }

    if (product!.description.length < 2) {
      validationErrors.set(
        "description",
        "Mô tả sản phẩm bắt buộc nhập hơn 2 ký tự trở lên"
      );
    } else if (product!.description.length === 0) {
      validationErrors.set("description", "Mô tả sản phẩm không được để trống");
    }

    return validationErrors;
  };

  return (
    <>
      {product ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label className="">
              Mã sản phẩm <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="sku"
              value={product.sku}
              onChange={handleChange}
              disabled={isEdit}
              isInvalid={!!errors.get("sku")}
            />
            <Form.Text className="text-danger">{errors.get("sku")}</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3 ">
            <Form.Label>
              Tên sản phẩm <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              disabled={isEdit}
              isInvalid={!!errors.get("name")}
            />
            <Form.Text className="text-danger">{errors.get("name")}</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3 ">
            <Form.Label className="mr-5">Phân loại sản phẩm </Form.Label>
            <Form.Select
              aria-label="Default select example"
              name="category"
              onChange={handleChange}
              value={product.category}
              isInvalid={!!errors.get("category")}
            >
              <option value="">Chọn phân loại</option>
              <option value="Burberry">Burberry</option>
              <option value="Dior">Dior</option>
              <option value="Chanel">Chanel</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3 ">
            <Form.Label>Giá tiền</Form.Label>
            <Form.Control
              type="text"
              name="unit_price"
              value={product.unit_price}
              onChange={handleChange}
              isInvalid={!!errors.get("unit_price")}
            />
            <Form.Text className="text-danger">
              {errors.get("unit_price")}
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3 ">
            <Form.Label>Mô tả sản phẩm</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={product.description}
              onChange={handleChange}
              isInvalid={!!errors.get("description")}
            />
            <Form.Text className="text-danger">
              {errors.get("description")}
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3 ">
            <Form.Label>Hình ảnh sản phẩm</Form.Label>
            <Form.Control
              type="file"
              name="image"
              accept="image/png, image/jpeg, image/gif, image/jfif, image/webp"
              onChange={handleChange}
              multiple
            />
            <Form.Text className="text-danger">{errors.get("image")}</Form.Text>
          </Form.Group>

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
        <ResourceNotFound resourceName="sản phẩm" />
      )}
    </>
  );
};

export default ProductsForm;
function append(arg0: string, image: Blob) {
  throw new Error("Function not implemented.");
}
