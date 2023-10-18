import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import UserForm from "../../components/form/UserFrom";
import userApi from "../../apis/user.api";

function UserEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleUpdate = (user: FormData) => {
    userApi
      .updateUser(id, user)
      .then(() => {
        navigate("/users");
      })
      .catch((error) => {
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
      <h1 >Chỉnh sửa thông tin người dùng</h1>
      <UserForm
        userId={id}
        onSubmit={handleUpdate}
        onCancel={() => navigate("/users")}
      />
    </>
  );
}

export default UserEdit;
