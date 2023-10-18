import React from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ContactForm from "../../components/form/ContactForm";
import ContactApi from "../../apis/contact.api";

function ContactEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const handleUpdate = (contact: any) => {
    ContactApi.updateContact(id, contact)
      .then(() => {
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
      <h1>Chỉnh sửa thông tin liên hệ</h1>
      <ContactForm
        contactId={id}
        onSubmit={handleUpdate}
        onCancel={() => navigate("/contacts")}
      />
    </>
  );
}

export default ContactEdit;
