import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { hideComments } from "../store/commentsSlice";

type comment = {
  "id": number,
  "body": string,
  "date": string,
}

const CommentsBackgroundContainer = styled.div<{ isShow: boolean }>`
  position: fixed;
  display: ${props => props.isShow ? `flex` : "none"};
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  z-index: 99;
  animation: FadeIn 250ms linear;

  @keyframes FadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  color: white;
`;

const ContentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  width: 60%;
  height: 95%;
  background: #282c34;
`;

const CommentsContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: start;
  overflow-y: scroll;


  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    height: 30%;
    background: #217af4;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(33, 122, 244, .1);
  }
`;

const CommentItemContainer = styled.div`
  margin: 0 1rem 1rem 1rem;
`;

const CommentBody = styled.div`
  padding: 0.5rem;
  background: #52565c;
  border-radius: 3px;
  color: white;
`;

const CommentDate = styled.div`
  font-size: 0.5rem;
  text-align: right;
`;

const InputContainer = styled.div`
  display: flex;
`;

const InputInput = styled.input`
  flex-grow: 3;
  padding: 10px;
  border: 0;
`;

const SubmitButton = styled.button`
  flex-grow: 1;
  border: 0;
  background: #282c34;
  color: #61dafb;
  font-weight: 800;

  &:hover {
    cursor: pointer;
    background: #1b1d21;
  }
`;

const HeaderIcon = styled.div`
  &:hover {
    cursor: pointer;
  }
  &:active {
    opacity: 0.5;
  }
`;

const Comments = () => {
  const [comments, setComments] = useState<comment[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();
  const visibility = useSelector((state: RootState) => {
    return state.comments.value;
  });

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
      console.log("to bottom");
    }
  }

  const getComments = () => {
    axios.get("http://192.168.121.36:4000/api/comments")
      .then((response) => {
        setComments(response.data);
      });
  };

  useEffect(() => {
    if (visibility) {
      getComments();
      scrollToBottom();
    }
  }, [visibility]);

  useEffect(scrollToBottom, [comments]);

  const onClose = () => {
    dispatch(hideComments());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onSubmit = () => {
    if (input) {
      axios.post("http://192.168.121.36:4000/api/comments", { "body": input, "date": new Date().toLocaleString() })
        .then(() => {
          setInput("");
          getComments();
        });
    }
  };

  const onKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  }

  return (
    <CommentsBackgroundContainer isShow={visibility} onClick={onClose}>
      <ContentsContainer onClick={e => e.stopPropagation()}>
        <HeaderContainer>
          <HeaderIcon  onClick={getComments}>♻️</HeaderIcon>
          <div>방명록</div>
          <HeaderIcon onClick={onClose}>❌</HeaderIcon>
        </HeaderContainer>
        <CommentsContainer ref={scrollRef}>
          {comments &&
            comments.map((cmt, index) => (
              <CommentItemContainer key={index}>
                <CommentBody>
                  {cmt.body}
                </CommentBody>
                <CommentDate>
                  {cmt.date}
                </CommentDate>
              </CommentItemContainer>
            ))
          }
        </CommentsContainer>
        <InputContainer>
          <InputInput placeholder="멋져요" onChange={handleChange} value={input} onKeyDown={onKeyPress}/>
          <SubmitButton onClick={onSubmit}>등록</SubmitButton>
        </InputContainer>
      </ContentsContainer>
    </CommentsBackgroundContainer>
  );
};

export default Comments;