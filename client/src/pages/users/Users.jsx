import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PrivateContent, H2 } from "../../components";
import { TableRow, UserRow } from "./components";
import { selectUserRole } from "../../selectors";
import { checkAccess, request } from "../../utils";
import { ROLE } from "../../constans/role";
import styled from "styled-components";

const UsersContainer = ({ className }) => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [shouldUpdateUserList, setShouldUpdateUserList] = useState(false);
  const userRole = useSelector(selectUserRole);

  useEffect(() => {
    if (!checkAccess([ROLE.ADMIN], userRole)) {
      return;
    }
    Promise.all([
      request("/api/users"), 
      request("/api/users/roles")]).then(
      ([usersRes, rolesRes]) => {
        if (usersRes.error || rolesRes.error) {
          setErrorMessage(usersRes.error || rolesRes.error);
          return;
        }
        setUsers(usersRes.data);
        setRoles(rolesRes.data);
      }
    );
  }, [shouldUpdateUserList, userRole]);

  const onUserRemove = (userId) => {
    if (!checkAccess([ROLE.ADMIN], userRole)) {
      return;
    }
    request(`/api/users/${userId}`, "DELETE").then(() => {
      setShouldUpdateUserList(!shouldUpdateUserList);
    });
  };
  return (
    <PrivateContent access={[ROLE.ADMIN]} serverError={errorMessage}>
      <div className={className}>
        <H2>Пользователи</H2>
        <div>
          <TableRow>
            <div className="login-column">Логин</div>
            <div className="registered-at-column">Дата регистрации</div>
            <div className="role-column">Роль</div>
          </TableRow>
          {users.map(({ id, login, registeredAt, roleId }) => (
            <UserRow
              key={id}
              id={id}
              login={login}
              registeredAt={registeredAt}
              roleId={roleId}
              roles={roles.filter(
                ({ id: roleId }) => roleId !== ROLE.GUEST,
              )}
              onUserRemove={() => onUserRemove(id)}
            />
          ))}
        </div>
      </div>
    </PrivateContent>
  );
};

export const Users = styled(UsersContainer)`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  align-items: center;
  width: 570px;
  font-size: 18px;
`;
