import React from "react";
import styled from "styled-components";
import Author from "./Author";
import { NavLink } from "react-router-dom";
import LoginInMenu from "./login/LoginInMenu";

export const SideExpand = 300;
export const SideContract = 70;

const SideMenuContainer = styled.div`
  position: fixed;
  left: 0;
  width: ${SideExpand}px;
  height: 100vh;
  text-align: center;
  background: #626977;
  
  @media ( max-width: 767px ) {
    width: ${SideContract}px;
  }
`;

const SideMenuHeader = styled.div`
  margin: 25px 0;
  font-size: 2.5rem;
  font-family: "DoHyeon";
  font-weight: bold;
  color: #181b1f;
  cursor: default;
  
  @media ( max-width: 767px ) {
    display: none;
  }
`;

const SideMenuContent = styled(NavLink)`
  display: block;
  padding: 15px 0;
  cursor: pointer;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 600;
  color: #181b1f;
  
  & + & {
    border-top: #282c34 2px solid;
  }
  
  @media ( max-width: 767px ) {
    span {
      display: none;
    }
  }
  
  &.active {
    background: #282c34;
    color: #626977;
  }
  `;

const SideMenu = () => {
  return (
    <SideMenuContainer>
      <SideMenuHeader>선풍기</SideMenuHeader>
      <LoginInMenu/>
      <SideMenuContent to="/">🏠<span> HOME</span></SideMenuContent>
      <SideMenuContent to="/wordle">🧩️<span> WORDLE</span></SideMenuContent>
      <SideMenuContent to="/comments">📝<span> 방명록</span></SideMenuContent>
      <SideMenuContent to="/catch/painter">🎨<span> 공사중</span></SideMenuContent>
      <Author/>
    </SideMenuContainer>
  );
};

export default SideMenu;