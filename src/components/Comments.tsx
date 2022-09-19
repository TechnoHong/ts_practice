import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import TenorSearch from "./TenorSearch";
import useInterval from "../hooks/useInterval";
import { SideContract, SideExpand } from "./SideMenu";
import { useAppSelector } from "../hooks/reduxHooks";
import { useDragAndDrop } from "../hooks/useDragAndDrop";

type comment = {
  "id": number,
  "body"?: string,
  "date": string,
  "url"?: string,
  "type": string,
  "sender"?: string,
}

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  color: white;
`;

const ContentsContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #282c34;
  height: 100vh;
  margin-left: ${SideExpand}px;

  @media ( max-width: 767px ) {
    margin-left: ${SideContract}px;
  }
`;

const CommentsContainer = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  align-items: start;
  overflow-y: scroll;
  overflow-x: hidden;

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

const CommentBody = styled.div<{ type: string }>`
  padding: 0.5rem;
  background: ${props => props.type === "wordleNotice" ? "#F0AD4E" : "#52565c"};
  font-size: ${props => props.type === "wordleNotice" ? "0.75rem" : "1rem"};
  border-radius: 3px;
  color: white;
  white-space: pre-wrap;
`;

const CommentSender = styled.div`
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 1px;
  color: #dadada;
  margin-bottom: 3px;
`;

const CommentDate = styled.div`
  font-size: 0.5rem;
  text-align: right;
  color: gray;
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

const AutoRefreshController = styled.div`
  font-size: 0.5rem;
  cursor: pointer;
`;

const GifImage = styled.img`
  height: 150px;
`;

const NoticeContainer = styled.div`
  margin: auto;
  white-space: pre-wrap;
  text-align: center;
  color: white;
  font-weight: 800;
  font-size: 3rem;
`;

const Comments = () => {
  const [comments, setComments] = useState<comment[]>([]);
  const [input, setInput] = useState("");
  const [gifMode, setGifMode] = useState(false);
  const [error, setError] = useState(false);
  const [count, setCount] = useState(5);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const dragRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const userData = useAppSelector(state => {
    return state.user;
  });

  const onUploadFile = useCallback(async (e: React.ChangeEvent<HTMLInputElement> | any) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const uploadFile = e.dataTransfer.files[0];

      const formData = new FormData();
      formData.append("file", uploadFile);

      try {
        const res = await axios.post("http://192.168.121.36:4000/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        axios.post("http://192.168.121.36:4000/api/comments", {
          "body": null,
          "date": new Date().toLocaleString(),
          "url": "http://192.168.121.36:4000/uploads/" + res.data.filename,
          "type": "customImg",
          "sender": userData.userData.username || "비회원",
        })
          .then(() => {
            setInput("");
            getComments();
          });

      } catch (e) {
        console.log(e);
      }
    }
  }, []);
  useDragAndDrop(onUploadFile, dragRef);

  useInterval(() => {
    if (count === 0) {
      getComments();
      console.log("refresh");
    } else {
      setCount(count - 1);
    }
  }, autoRefresh ? 1000 : null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo(0, scrollRef.current.scrollHeight);
      console.log("to bottom");
    }
  };

  const getComments = () => {
    setCount(5);
    axios.get("http://192.168.121.36:4000/api/comments")
      .then((response) => {
        setComments(response.data);
        setError(false);
      })
      .catch(() => {
        setError(true);
      });
  };

  useEffect(() => {
    getComments();
    scrollToBottom();
  }, []);

  useEffect(scrollToBottom, [comments]);

  useEffect(() => {
    if (input.startsWith("$")) {
      setGifMode(true);
    } else {
      setGifMode(false);
    }
  }, [input]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const onSubmit = () => {
    if (input) {
      axios.post("http://192.168.121.36:4000/api/comments", {
        "body": input,
        "date": new Date().toLocaleString(),
        "url": null,
        "type": "chat",
        "sender": userData.userData.username || "비회원",
      })
        .then(() => {
          setInput("");
          getComments();
        });
    }
  };

  const onKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSubmit();
    }
  };

  const onAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  return (
    <ContentsContainer>
      <HeaderContainer>
        <HeaderIcon onClick={getComments}>♻️<span
          style={{ fontSize: "0.75rem", whiteSpace: "pre" }}> {count}초 뒤 새로고침..</span></HeaderIcon>
        <AutoRefreshController onClick={onAutoRefresh}>자동 새로고침 {autoRefresh ? "켜짐" : "꺼짐"}</AutoRefreshController>
      </HeaderContainer>
      <CommentsContainer ref={scrollRef}>
        {(comments && !error) &&
          comments.map((cmt, index) => (
            <CommentItemContainer key={index}>
              {
                cmt.sender &&
                <CommentSender>
                  {cmt.sender}
                </CommentSender>
              }
              {
                cmt.url &&
                <GifImage src={cmt.url} />
              }
              {
                cmt.body &&
                <CommentBody type={cmt.type ? cmt.type : ""}>
                  {cmt.body}
                </CommentBody>
              }
              <CommentDate>
                {cmt.date}
              </CommentDate>
            </CommentItemContainer>
          ))
        }
        {
          error &&
          <NoticeContainer>{"🤔\nError"}</NoticeContainer>
        }
        {
          (!error && comments.length === 0) &&
          <NoticeContainer>{"💁‍♂️\nHello!"}</NoticeContainer>
        }
      </CommentsContainer>
      {
        (gifMode && !error) &&
        <TenorSearch gifMode={setGifMode} input={input.slice(1)} setInput={setInput} getComments={getComments} />
      }
      <InputContainer ref={dragRef}>
        <InputInput placeholder="$로 시작해서 gif를 검색 / 이미지파일을 여기에 드래그" onChange={handleChange} value={input} onKeyDown={onKeyPress} />
        <SubmitButton onClick={onSubmit}>등록</SubmitButton>
      </InputContainer>
      <div>
        <input
          type="file"
          id="fileUpload"
          style={{ display: "none" }}
        />
      </div>
    </ContentsContainer>
  );
};

export default Comments;