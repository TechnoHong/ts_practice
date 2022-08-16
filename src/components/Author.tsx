import React from "react";
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
  return (
    <AuthorContainer>
      <AuthorHeaderContainer>
        v1.1.0 @Hong
      </AuthorHeaderContainer>
      <AuthorSubContainer>
        신규기능 : 이미지 파일 Drag&Drop 📁
      </AuthorSubContainer>
      <AuthorSubContainer>
        피드백은 DM으로 부탁드려요🙏
      </AuthorSubContainer>
    </AuthorContainer>
  );
};

export default Author;