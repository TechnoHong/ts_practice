import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const WordleDescriptionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  margin-top: 2rem;
`;

const WordleInvalidContainer = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #E84664;
  animation: fadeout 5s forwards;

  @keyframes fadeout {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

const WordleCorrectContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const WordleCongratulationContainer = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: #97E846;
`;

const WordleSwagButton = styled.button`
  animation: jittery 4s infinite;
  height: 2rem;
  padding: 0 1rem;
  color: #C9CACC;
  background: #222222;
  border-radius: 9999px;

  &:hover {
    cursor: pointer;
  }

  &:active {
    color: #222222;
    background: #C9CACC;
  }

  @keyframes jittery {
    5%,
    50% {
      transform: scale(1);
    }
    10% {
      transform: scale(0.9);
    }
    15% {
      transform: scale(1.15);
    }
    20% {
      transform: scale(1.15) rotate(-5deg);
    }
    25% {
      transform: scale(1.15) rotate(5deg);
    }
    30% {
      transform: scale(1.15) rotate(-3deg);
    }
    35% {
      transform: scale(1.15) rotate(2deg);
    }
    40% {
      transform: scale(1.15) rotate(0);
    }
  }
`;

const WordleFailContainer = styled.div`
  font-size: 2rem;
  font-weight: 600;
  color: #e83b3b;
`;

const WordleValidationContainer = styled.div`
  font-size: 1rem;
  font-weight: 400;
  color: #e0d4a3;
`;

type WordleProps = {
  desc: string,
  tryCount: number,
}

const WordleDescription = ({ desc, tryCount }: WordleProps) => {
  const [swag, isSwag] = useState(false);

  const onSubmit = () => {
    axios.post("http://192.168.121.36:4000/api/comments", {
      "body": `[Wordle] 💃 누군가 ${tryCount} 번 만에 성공! 👯‍♂️`,
      "date": new Date().toLocaleString(),
      "url": null,
      "type": "wordleNotice",
    })
      .then(() => {
        isSwag(true);
      });
  };

  return (
    <WordleDescriptionContainer>
      {
        desc === "INVALID" &&
        <WordleInvalidContainer>
          정확한 단어를 입력하세요
        </WordleInvalidContainer>
      }
      {
        desc === "CORRECT" &&
        <WordleCorrectContainer>
          <WordleCongratulationContainer>
            {tryCount} 번 만에 정답!
          </WordleCongratulationContainer>
          {
            !swag &&
            <WordleSwagButton onClick={onSubmit}>
              Swag
            </WordleSwagButton>
          }
        </WordleCorrectContainer>
      }
      {
        desc === "VERIFICATION" &&
        <WordleValidationContainer>
          검증 중..
        </WordleValidationContainer>
      }
      {
        desc === "FAILED" &&
        <WordleFailContainer>
          실패..
        </WordleFailContainer>
      }
    </WordleDescriptionContainer>
  );
};

export default WordleDescription;