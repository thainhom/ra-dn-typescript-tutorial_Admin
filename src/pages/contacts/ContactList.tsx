import React, { useEffect, useState } from "react";
import { Table, Button, Form, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import AdminPaginationComponent, {
  NUMBER_RECORDS_PER_PAGE,
} from "../../components/table/Pagination";
import contactApi from "../../apis/contact.api";

interface Contact {
  contact_id: number;
  full_name: string;
  email: string;
  content: string;
  status: number;
  created_at: string;
  updated_at: string;
}
interface ContactDataResponse {
  records: Contact[];
  total: number;
}

const formatStatus = (status: number) => {
  if (status === 1) {
    return <Badge bg="warning">Liên hệ mới</Badge>;
  } else if (status === 2) {
    return <Badge bg="info">Đã nhận</Badge>;
  } else if (status === 3) {
    return <Badge bg="danger">Bị từ chối</Badge>;
  }
};
function ContactList() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);

  const [searchInputValue, setSearchInputValue] = useState("");
  const [keyword, setKeyword] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [selecteContactIds, setSelecteContactIds] = useState<number[]>([]);

  const fetchContacts = () => {
    contactApi
      .searchContacts({
        keyword: keyword,
        page: page,
        limit: NUMBER_RECORDS_PER_PAGE,
      })
      .then((data) => {
        if ("records" in data && "total" in data) {
          const userDataResponse = data as ContactDataResponse;
          setContacts(userDataResponse.records);
          setTotal(userDataResponse.total);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          alert(error.response.statusText);
          navigate("/login");
        } else {
          alert(error.response ? error.response.statusText : "Error occurred");
        }
      });

    setSelecteContactIds([]);
  };

  useEffect(() => {
    fetchContacts();
  }, [keyword, page]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setKeyword(searchInputValue);
  };

  const handleAdd = () => {
    navigate("/contacts/new");
  };

  const handleEdit = (id: number) => {
    navigate(`/contacts/${id}/edit`);
  };

  const handleBulkDelete = () => {
    const selectedContacts = contacts.filter((contact) =>
      selecteContactIds.includes(contact.contact_id)
    );
    const fullNames = selectedContacts.map((contact) => contact.full_name);

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa liên hệ ${fullNames.join(", ")} không ?`
      )
    ) {
      // TODO: Xử lý xóa
      fetchContacts();
    }
  };

  const handleDelete = (id: number, full_name: string) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa liên hệ ${full_name} không ?`)
    ) {
      contactApi
        .deleteContact(id.toString())
        .then(() => {
          fetchContacts();
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            alert(error.response.statusText);
            navigate("/login");
          } else {
            alert(
              error.response ? error.response.statusText : "Error occurred"
            );
          }
        });
    }
  };

  const changeUserIdCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    const contactId = parseInt(event.target.value);

    if (event.target.checked) {
      setSelecteContactIds([...selecteContactIds, contactId]);
    } else {
      const newSelecteContactIds = selecteContactIds.filter(
        (contactId) => contactId !== contactId
      );
      setSelecteContactIds(newSelecteContactIds);
    }
  };

  const selectAllContactIdCheckboxes = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      const contactIds = contacts.map((contact) => contact.contact_id);
      setSelecteContactIds(contactIds);
    } else {
      setSelecteContactIds([]);
    }
  };

  const isSelectedAllContactIds =
    selecteContactIds.length !== 0 &&
    selecteContactIds.length === contacts.length;

  return (
    <>
      <h1>Danh sách Liên hệ</h1>
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
          {selecteContactIds.length !== 0 && (
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
                onChange={selectAllContactIdCheckboxes}
                checked={isSelectedAllContactIds}
              />
            </th>
            <th>Tên người liên hệ</th>
            <th>Email người liên hệ</th>
            <th>Nội dung người liên hệ</th>
            <th>Trạng thái</th>
            <th>Thời gian tạo</th>
            <th>Thời gian cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => {
            return (
              <tr key={index}>
                <td>
                  <Form.Check
                    type="checkbox"
                    name="contact_id"
                    id={`contact_id-${contact.contact_id}`}
                    value={contact.contact_id}
                    onChange={changeUserIdCheckbox}
                    checked={selecteContactIds.includes(contact.contact_id)}
                  />
                </td>
                <td>{contact.full_name}</td>
                <td>{contact.email}</td>
                <td>{contact.content}</td>
                <td>{formatStatus(contact.status)}</td>
                <td>{moment(contact.created_at).format("YYYY-MM-DD HH:mm")}</td>
                <td>{moment(contact.updated_at).format("YYYY-MM-DD HH:mm")}</td>
                <td>
                  <Button
                    variant="warning"
                    className="m-1"
                    onClick={() => handleEdit(contact.contact_id)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="danger"
                    className="m-1"
                    onClick={() =>
                      handleDelete(contact.contact_id, contact.full_name)
                    }
                  >
                    Xóa
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
      <AdminPaginationComponent total={total} setPage={setPage} />
    </>
  );
}

export default ContactList;
