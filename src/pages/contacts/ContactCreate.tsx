import React from "react";
import { useNavigate } from "react-router-dom";
import ContactForm from "../../components/form/ContactForm";
import contactApi from "../../apis/contact.api";

function ContactCreate() {
  const navigate = useNavigate();

  const handleAdd = (product: any) => {
    contactApi
      .createContact(product)
      .then((response) => {
        navigate("/contacts");
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          alert(error.response.statusText);
          navigate("/login");
        } else {
          alert(error.response ? error.response.statusText : "Error occurred");
        }
      });
  };

  return (
    <>
      <h1 >Thêm mới liên hệ</h1>
      <ContactForm
        onSubmit={handleAdd}
        onCancel={() => navigate("/contacts")}
      />
    </>
  );
}

export default ContactCreate;
