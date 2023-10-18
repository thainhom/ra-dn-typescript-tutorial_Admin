import React, { useState, useEffect } from "react";
import { Table, Button, Form, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import moment from "moment/moment";
import AdminPaginationComponent, {
  NUMBER_RECORDS_PER_PAGE,
} from "../../components/table/Pagination";

import userApi from "../../apis/user.api";

interface User {
  user_id: number;
  username: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  role: number;
  created_at: string;
  updated_at: string;
}
interface UserDataResponse {
  records: User[];
  total: number;
}

const formatName = (firstName: string | null, lastName: string | null) => {
  return (firstName || "") + " " + (lastName || "");
};

const formatRole = (role: number) => {
  if (role === 1) {
    return <Badge bg="warning">Quản trị viên</Badge>;
  } else if (role === 2) {
    return <Badge>Khách hàng</Badge>;
  }
};

const UserList: React.FC = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);

  const [searchInputValue, setSearchInputValue] = useState("");

  const [keyword, setKeyword] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);

  const fetchUsers = () => {
    userApi
      .searchUsers({
        name: keyword,
        page: page,
        limit: NUMBER_RECORDS_PER_PAGE,
      })
      .then((data) => {
        if ("records" in data && "total" in data) {
          const userDataResponse = data as UserDataResponse;
          setUsers(userDataResponse.records);
          setTotal(userDataResponse.total);
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          alert(error.response.statusText);
          navigate("/login");
        } else {
          alert(error.response.statusText);
        }
      });

    setSelectedUserIds([]);
  };

  useEffect(() => {
    fetchUsers();
  }, [keyword, page]);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setKeyword(searchInputValue);
  };

  const handleAdd = () => {
    navigate("/users/new");
  };

  const handleEdit = (id: number) => {
    navigate(`/users/${id}/edit`);
  };

  const handleBulkDelete = () => {
    const usernames = users
      .filter((user) => selectedUserIds.includes(user.user_id))
      .map((user) => user.username);

    if (
      window.confirm(
        `Bạn có chắc chắn muốn xóa người dùng [${usernames}] không ?`
      )
    ) {
      // TODO
      fetchUsers();
    }
  };

  const handleDelete = (id: number, username: string) => {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa người dùng ${username} không ?`)
    ) {
      userApi
        .deleteUser(id)
        .then(() => {
          fetchUsers();
        })
        .catch((error) => {
          if (error.response.status === 401) {
            alert(error.response.statusText);
            navigate("/login");
          } else {
            alert(error.response.statusText);
          }
        });
    }
  };

  const changeUserIdCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedUserIds([...selectedUserIds, parseInt(event.target.value)]);
    } else {
      const newSelectedUserIds = selectedUserIds.filter(
        (selectedUserId) => selectedUserId !== parseInt(event.target.value)
      );
      setSelectedUserIds(newSelectedUserIds);
    }
  };

  const selectAllUserIdCheckboxes = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      const userIds = users.map((user) => user.user_id);
      setSelectedUserIds(userIds);
    } else {
      setSelectedUserIds([]);
    }
  };

  const isSelectedAllUserId =
    selectedUserIds.length !== 0 && selectedUserIds.length === users.length;

  return (
    <>
      <h1>Danh sách người dùng</h1>
      <Form className="row m-1 mb-3" onSubmit={handleSearch}>
        <div className="col-8">
          <Form.Control
            type="text"
            value={searchInputValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setSearchInputValue(event.target.value)
            }
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
          {selectedUserIds.length !== 0 && (
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
                onChange={selectAllUserIdCheckboxes}
                checked={isSelectedAllUserId}
              />
            </th>
            <th>Tên đăng nhập</th>
            <th>Địa chỉ E-mail</th>
            <th>Tên người dùng</th>
            <th>Vai trò</th>
            <th>Thời gian tạo</th>
            <th>Thời gian cập nhật</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => {
            return (
              <tr key={index}>
                <td>
                  <Form.Check
                    type="checkbox"
                    name="user_id"
                    id={"user_id-" + user.user_id}
                    value={user.user_id}
                    onChange={changeUserIdCheckbox}
                    checked={selectedUserIds.includes(user.user_id)}
                  />
                </td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{formatName(user.first_name, user.last_name)}</td>
                <td>{formatRole(user.role)}</td>
                <td>{moment(user.created_at).format("YYYY-MM-DD HH:mm")}</td>
                <td>{moment(user.updated_at).format("YYYY-MM-DD HH:mm")}</td>
                <td>
                  <Button
                    variant="warning"
                    className="m-1"
                    onClick={() => handleEdit(user.user_id)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="danger"
                    className="m-1"
                    onClick={() => handleDelete(user.user_id, user.username)}
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
};

export default UserList;
