import React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useAppSelector } from "../../hooks/reduxHooks";
import UserInfo from "./UserInfo";

const AccountContainer = styled.div`
  margin: 20px 0;
`;

const LoginButton = styled(NavLink)`
  width: 70%;
  display: block;
  padding: 7px 15px;
  margin: 0 auto;
  cursor: pointer;
  text-decoration: none;
  font-size: 1rem;
  font-family: DoHyeon;
  background: aliceblue;
  color: #1e6b7b;
  border-radius: 5px;
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.2);
  transition: 0.25s;

  &:hover {
    letter-spacing: 2px;
    transform: scale(1.2);
    cursor: pointer;
  }

  &:active {
    transform: scale(1.5);
  }

  @media ( max-width: 767px ) {
    border: none;
    background: transparent;
    font-size: 0.5rem;
    color: white;
    transition: none;
    box-shadow: none;
    padding: 0;
  }
`;

const LoginInMenu = () => {
  const userData = useAppSelector(state => {
    return state.user;
  });

  return (
    <AccountContainer>
      {
        userData.logged ? <UserInfo userState={userData}/>
          : <LoginButton to="/login">로그인</LoginButton>
      }
    </AccountContainer>
  );
};

export default LoginInMenu;