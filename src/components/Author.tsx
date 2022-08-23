import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { showModal } from "../store/modalSlice";

const AuthorContainer = styled.div`
  position: absolute;
  bottom: 3px;
  right: 3px;
  text-align: right;
`;

const AuthorHeaderContainer = styled.div`
  color: #61dafb;
  font-size: 0.5rem;
`;

const AuthorPatchNoteContainer = styled(AuthorHeaderContainer)`
  &:hover {
    cursor: pointer;
    text-decoration: underline white;
  }
`;

const AuthorSubContainer = styled.div`
  font-size: 0.5rem;
`;

const Author = () => {
  const [dm, setDM] = useState("DM");
  const dispatch = useDispatch();

  const onHover = () => {
    setDM("DaouMessenger");
  }

  const onLeave = () => {
    setDM("DM");
  }

  const onClick = () => {
    dispatch(showModal());
  }

  return (
    <AuthorContainer>
      <AuthorHeaderContainer>
        @Hong
      </AuthorHeaderContainer>
      <AuthorPatchNoteContainer onClick={onClick}>
        v1.2.0 패치노트
      </AuthorPatchNoteContainer>
      <AuthorSubContainer>
        피드백은 <span style={{color: "#61dafb"}} onMouseOver={onHover} onMouseLeave={onLeave}>{dm}</span> 부탁드려요🙏
      </AuthorSubContainer>
    </AuthorContainer>
  );
};

export default Author;