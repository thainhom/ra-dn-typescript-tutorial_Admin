import { useNavigate } from "react-router-dom";
import UserForm from "../../components/form/UserFrom";

import userApi from "../../apis/user.api";

function UserCreate() {
  const navigate = useNavigate();

  const handleAdd = (user: any) => {
    userApi
      .createUser(user)
      .then((response: any) => {
        navigate("/users");
      })
      .catch((error: any) => {
        if (error.response.status === 401) {
          alert(error.response.statusText);
          navigate("/login");
        } else {
          alert(error.response.statusText);
        }
      });
  };

  return (
    <>
      <h1>Thêm mới người dùng</h1>
      <UserForm onSubmit={handleAdd} onCancel={() => navigate("/users")} />
    </>
  );
}

export default UserCreate;
