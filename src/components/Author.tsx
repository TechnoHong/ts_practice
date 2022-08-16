import React, { useState } from "react";
import styled from "styled-components";

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

const AuthorSubContainer = styled.div`
  font-size: 0.5rem;
`;

const Author = () => {
  const [dm, setDM] = useState("DM");

  const onHover = () => {
    setDM("DaouMessenger");
  }

  const onLeave = () => {
    setDM("DM");
  }

  return (
    <AuthorContainer>
      <AuthorHeaderContainer>
        v1.1.1 @Hong
      </AuthorHeaderContainer>
      <AuthorSubContainer>
        신규기능 : 이미지 파일 Drag&Drop 📁
      </AuthorSubContainer>
      <AuthorSubContainer>
        피드백은 <span style={{color: "#61dafb"}} onMouseOver={onHover} onMouseLeave={onLeave}>{dm}</span> 부탁드려요🙏
      </AuthorSubContainer>
    </AuthorContainer>
  );
};

export default Author;