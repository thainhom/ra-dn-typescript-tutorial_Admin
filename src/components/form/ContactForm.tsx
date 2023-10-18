import React, { useEffect, useState } from "react";
import { Form, Button, FormCheck } from "react-bootstrap";
import ResourceNotFound from "../errors/ResourceNotFound";
import contactApi from "../../apis/contact.api";

interface Contact {
  full_name: string;
  email: string;
  content: string;
  status: number;
}

interface ContactFormProps {
  contactId?: string | undefined;
  onSubmit: (contact: Contact) => void;
  onCancel: () => void;
}

function ContactForm({ contactId, onSubmit, onCancel }: ContactFormProps) {
  const [isEdit, setIsEdit] = useState(false);
  const [contact, setContact] = useState<Contact | null>(null);
  const [errors, setErrors] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    setIsEdit(contactId !== undefined);

    if (contactId === undefined) {
      setContact({
        full_name: "",
        email: "",
        content: "",
        status: 0,
      });
    } else {
      contactApi
        .getContactByContactId(contactId)
        .then((response: Contact) => {
          setContact({
            ...response,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [contactId]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value;

    if (name === "status") {
      if (value === "" || !isNaN(parseFloat(value))) {
        setContact((prevContact) => {
          if (prevContact) {
            return {
              ...prevContact,
              [name]: value === "" ? 0 : parseFloat(value),
            };
          }
          return prevContact;
        });
      }
    } else {
      setContact((prevContact) => {
        if (prevContact) {
          return {
            ...prevContact,
            [name]: value,
          };
        }
        return prevContact;
      });
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const validationErrors = validate();
    if (validationErrors.size === 0 && contact) {
      onSubmit(contact);
    } else {
      setErrors(validationErrors);
    }
  };

  const validate = () => {
    const validationErrors = new Map<string, string>();

    if (contact && contact.full_name.length === 0) {
      validationErrors.set("full_name", "Tên người liên hệ không được để trống");
    }

    if (contact && (contact.email.length < 4 || contact.email.length > 50)) {
      validationErrors.set("email", "Email chỉ cho phép từ 4 đến 50 ký")
    }
    
    if (contact && !/^\d+(\.\d{0,9})?$/.test(contact.status.toString())) {
      validationErrors.set("status", "Trạng thái là một số hợp lệ");
    }
    
    return validationErrors;
  };

  return (
    <>
      {contact ? (
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label >Tên người liên hệ <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="full_name"
              value={contact.full_name}
              onChange={handleChange}
              disabled={isEdit}
              isInvalid={!!errors.get("full_name")}
            />
            <Form.Text className="text-danger">{errors.get("full_name")}</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3 ">
            <Form.Label>Email người liên hệ <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={contact.email}
              onChange={handleChange}
              disabled={isEdit}
              isInvalid={!!errors.get("email")}
            />
            <Form.Text className="text-danger">{errors.get("email")}</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3 ">
            <Form.Label>Nội dung người liên hệ</Form.Label>
            <Form.Control
              type="text"
              name="content"
              value={contact.content}
              onChange={handleChange}
              isInvalid={!!errors.get("content")}
            />
            <Form.Text className="text-danger">{errors.get("content")}</Form.Text>
          </Form.Group>

          <Form.Group className="mb-3 ">
            <Form.Label className="mr-5">Trạng thái liên hệ</Form.Label>
            <div className="px-3">
              <Form.Check
                inline
                type="radio"
                name="status"
                label="Liên hệ mới"
                id="status-1"
                value={1}
                checked={contact.status === 1}
                onChange={handleChange}
              />
              <Form.Check
                inline
                type="radio"
                name="status"
                label="Đã nhận"
                id="status-2"
                value={2}
                checked={contact.status === 2}
                onChange={handleChange}
              />
              <Form.Check
                inline
                type="radio"
                name="status"
                label="Bị từ chối"
                id="status-3"
                value={3}
                checked={contact.status === 3}
                onChange={handleChange}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3 float-end ">
            <Button type="button" variant="secondary" className="m-1" onClick={onCancel}>
              Hủy
            </Button>
            <Button type="submit" variant="success" className="m-1">
              Lưu
            </Button>
          </Form.Group>
        </Form>
      ) : (
        <ResourceNotFound resourceName="Liên hệ" />
      )}
    </>
  );
}

export default ContactForm;

