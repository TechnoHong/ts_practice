import React from "react";
import axios from "axios";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { hideWordle } from "../../store/wordleSlice";

const OWLBOT_KEY = process.env.REACT_APP_OWLBOT_KEY;

const WordleBackgroundContainer = styled.div<{ isShow: boolean }>`
  position: fixed;
  display: ${props => props.isShow ? `flex` : `none`};
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

const WordleContentContainer = styled.div`
  display: block;
  background: #282c34;
  margin: 0 auto;
  border-radius: 1rem;
  padding: 3rem;
`;

const WordleMainContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const WordleWordContainer = styled.div`
  & + & {
    margin-top: 0.5rem;
  }
`;

const WordleAlphabetContainer = styled.span`
  display: inline-block;
  font-size: 3rem;
  font-weight: 600;
  text-align: center;
  vertical-align: middle;
  width: 60px;
  height: 80px;
  line-height: 80px;
  border: black 3px solid;
  border-radius: 5px;
  
  & + & {
    margin-left: 0.25rem;
  }
`;

const Wordle = () => {
  const wordle = useSelector((state: RootState) => {
    return state.wordle.value;
  });
  const dispatch = useDispatch();

  const onClose = () => {
    dispatch(hideWordle());
  }

  // axios.get("https://owlbot.info/api/v4/dictionary/owl", {
  //   headers: {
  //     Authentication: "Token " + OWLBOT_KEY!,
  //   },
  // })
  //   .then((response) => {
  //     console.log(response.data);
  //   });
  return (
    <WordleBackgroundContainer isShow={wordle} onClick={onClose}>
      <WordleContentContainer onClick={e => e.stopPropagation()}>
        <WordleMainContent>
          <WordleWordContainer>
            <WordleAlphabetContainer>a</WordleAlphabetContainer>
            <WordleAlphabetContainer>b</WordleAlphabetContainer>
            <WordleAlphabetContainer>c</WordleAlphabetContainer>
          </WordleWordContainer>
          <WordleWordContainer>
            <WordleAlphabetContainer></WordleAlphabetContainer>
            <WordleAlphabetContainer></WordleAlphabetContainer>
            <WordleAlphabetContainer></WordleAlphabetContainer>
          </WordleWordContainer>
        </WordleMainContent>
      </WordleContentContainer>
    </WordleBackgroundContainer>
  );
};

export default Wordle;