import React from "react";
import styled from "styled-components";

const WordleKeyPadContainer = styled.div`
  display: none;

  @media ( max-width: 767px ) {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const WordleFunctionContainer = styled.div`
  display: flex;
`;

const WordleKeyLineContainer = styled.div`
    margin-top: 3px;
`;

const WordleFunctionButton = styled.button`
  flex-basis: 50%;
`;

const WordleKeyButton = styled.button`
  width: 6vmin;
  height: 6vmin;
  & + & {
    margin-left: 2px;
  }
  vertical-align: middle;
  text-align: center;
  font-size: 4vmin;
  line-height: 7vmin;
`;

type KeyPadProps = {
  inputKey(key: string): void,
}

const WordleKeyPad = ({ inputKey }: KeyPadProps) => {
  return (
    <WordleKeyPadContainer>
      <WordleFunctionContainer>
        <WordleFunctionButton
          value='Backspace'
          key='Backspace'
          onClick={() => inputKey("Backspace")}
        >BackSpace</WordleFunctionButton>
        <WordleFunctionButton
          value='Enter'
          key='Enter'
          onClick={() => inputKey("Enter")}
        >Enter</WordleFunctionButton>
      </WordleFunctionContainer>
      <WordleKeyLineContainer>
        {["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"].map(key => (
          <WordleKeyButton
            value={key}
            key={key}
            onClick={() => inputKey(key)}
          >{key}</WordleKeyButton>
        ))}
      </WordleKeyLineContainer>
      <WordleKeyLineContainer>
        {["A", "S", "D", "F", "G", "H", "J", "K", "L"].map(key => (
          <WordleKeyButton
            value={key}
            key={key}
            onClick={() => inputKey(key)}
          >{key}</WordleKeyButton>
        ))}
      </WordleKeyLineContainer>
      <WordleKeyLineContainer>
        {["Z", "X", "C", "V", "B", "N", "M"].map(key => (
          <WordleKeyButton
            value={key}
            key={key}
            onClick={() => inputKey(key)}
          >{key}</WordleKeyButton>
        ))}
      </WordleKeyLineContainer>
    </WordleKeyPadContainer>
  );
};

export default WordleKeyPad;