import React from "react";
import styled from "styled-components";
import { showComments } from "../store/commentsSlice";
import ReactTooltip from "react-tooltip";
import { useDispatch } from "react-redux";
import { showWordle } from "../store/wordleSlice";

const ButtonsContainer = styled.div`
  display: flex;
  position: absolute;
  bottom: 10px;
  left: 10px;
  padding: 5px;
  
  button {
    background: transparent;
    font-size: 2rem;
    border: 0;

    &:hover {
      cursor: pointer;
    }
  }
`;

const TooltipText = styled.span`
  font-size: 0.75rem;
`;

const Menus = () => {
  const dispatch = useDispatch();

  return (
    <ButtonsContainer>
      <button data-tip data-for="visitNote" onClick={() => dispatch(showComments())}>🎍</button>
      <ReactTooltip id="visitNote" effect="solid">
        <TooltipText>방명록</TooltipText>
      </ReactTooltip>
      <button data-tip data-for="wordle" onClick={() => dispatch(showWordle())}>🔑</button>
      <ReactTooltip id="wordle" effect="solid">
        <TooltipText>개발중..</TooltipText>
      </ReactTooltip>
    </ButtonsContainer>
  );
};

export default Menus;