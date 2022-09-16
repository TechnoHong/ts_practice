import React from "react";
import { postLogout, UserState } from "../../store/userSlice";
import { useAppDispatch } from "../../hooks/reduxHooks";
import storage from "../../lib/storage";
import styled from "styled-components";

type UserProps = {
  userState: UserState,
}

const UserInfoContainer = styled.div`
`;

const UsernameContainer = styled.div`
  font-size: 1.25rem;
  font-family: DoHyeon;
  margin-bottom: 0.5rem;

  @media ( max-width: 767px ) {
    display: none;
  }
`;

const LogoutButton = styled.button`
  border: none;
  background: transparent;
  font-size: 0.5rem;
  color: white;
  cursor: pointer;
`;

const UserInfo = ({ userState }: UserProps) => {
  const dispatch = useAppDispatch();

  const onLogout = () => {
    dispatch(postLogout())
      .then(storage.remove("loginInfo"));

    window.location.href = "/";
  }

  return (
    <UserInfoContainer>
      <UsernameContainer>{userState.userData.username}</UsernameContainer>
      {/*<div>{userState.userData.point}</div>*/}
      <LogoutButton onClick={onLogout}>로그아웃</LogoutButton>
    </UserInfoContainer>
  );
};

export default UserInfo;