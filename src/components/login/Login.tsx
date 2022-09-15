import React, { useState } from "react";
import styled from "styled-components";
import { SideContract, SideExpand } from "../SideMenu";
import { postLogin, postRegister } from "../../store/userSlice";
import { useAppDispatch } from "../../hooks/reduxHooks";
import storage from "../../lib/storage";
import { useNavigate } from "react-router";

const LoginContainer = styled.form`
  background-color: #282c34;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-left: ${SideExpand}px;

  @media ( max-width: 767px ) {
    margin-left: ${SideContract}px;
  }
`;

const LoginInput = styled.input`
  width: 70%;
  max-width: 300px;
  height: 2rem;
  padding: 0 10px;
  border-radius: 999px;
  border: none;
  background: lightgray;
  color: #282c34;

  &:focus {
    background: white;
  }

  & + & {
    margin-top: 10px;
  }
`;

const LoginButton = styled.button`
  width: calc(70% + 20px);
  max-width: 320px;
  height: 2rem;
  border: none;
  border-radius: 999px;
  margin-top: 10px;
  background: #76a1ce;
  font-family: DoHyeon;
  font-size: 1rem;

  &:hover {
    cursor: pointer;
    background: #496581;
  }

  &:active {
    cursor: pointer;
    background: #80adda;
  }
`;

const LoginOptionContainer = styled.div`
  width: calc(70% + 20px);
  max-width: 320px;
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const RegisterButton = styled.div`
  color: white;
  text-decoration: underline;
  font-size: 0.75rem;
`;

const Login = () => {
  const [btnText, setBtnText] = useState<"로그인" | "회원가입">("로그인");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const onClickRegister = () => {
    setBtnText(() => "회원가입");
  };

  const onNameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value);
  };

  const onPasswordHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };

  const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body = {
      username: name,
      password: password,
    };

    if (btnText === "로그인") {
      try {
        dispatch(postLogin(body))
          .then(res => {
            if (res.payload.errorMessage) {
              console.log("로그인 실패?")
            } else {
              storage.set("loginInfo", body);
              navigate("/");
            }
          })
      } catch (e) {
        console.log("로그인 Error");
      }
      return;
    }

    if (btnText === "회원가입") {
      try {
        dispatch(postRegister(body))
          .then(res => {
            if (res.payload.errorMessage) {
              console.log("이미 있는?")
            } else {
              storage.set("loginInfo", body);
              navigate("/");
            }
          })
      } catch (e) {
        console.log("회원가입 Error");
      }
      return;
    }
  };

  return (
    <LoginContainer onSubmit={onSubmitHandler}>
      <LoginInput type="text" placeholder="이름" value={name} onChange={onNameHandler} />
      <LoginInput type="password" placeholder="비밀번호" value={password} onChange={onPasswordHandler} />
      <LoginButton>{btnText}</LoginButton>
      {
        btnText === "로그인" && (
          <LoginOptionContainer>
            <div>정보기억하기</div>
            <RegisterButton onClick={onClickRegister}>회원가입</RegisterButton>
          </LoginOptionContainer>
        )
      }
    </LoginContainer>
  );
};

export default Login;