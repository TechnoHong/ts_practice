import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import ReactTooltip from "react-tooltip";
import { lineType } from "./Wordle";

const WordleDescriptionContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  margin-top: 2rem;
  margin-bottom: 1rem;
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
  justify-content: space-around;
  align-items: center;
`;

const WordleCongratulationContainer = styled.div`
  font-size: 1.5rem;
  font-weight: 800;
  color: #97E846;
`;

const WordleHistoryButton = styled.div`
  border: 2px solid black;
  border-radius: 6px;
  padding: 2px 1rem;
  background: #222222;

  &:hover {
    cursor: default;
  }
`;

const WordleSwagButton = styled.button<{ swag: boolean }>`
  animation: jittery 4s infinite;
  animation-play-state: ${props => props.swag ? "paused" : "running"};
  height: 2rem;
  padding: 0 1rem;
  color: ${props => props.swag ? "#6e6f70" : "#C9CACC"};
  background: #222222;
  border-radius: 6px;

  &:hover {
    cursor: pointer;
  }

  &:active {
    color: #222222;
    background: #C9CACC;
  }
  
  &:disabled {
    color: #C9CACC;
    background: #222222;
    cursor: default;
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

const WordleHistoryContainer = styled.div`
  display: flex;
  margin: 10px 0;
`;

const HistoryCountContainer = styled.div<{ state: number }>`
  width: 2rem;
  color: ${props => handlerColorType(props.state)};
  font-weight: bolder;

  div {
    text-align: center;
  }

  & + & {
    margin-left: 5px;
  }
`;

const handlerColorType = (state: number) => {
  switch (state) {
    case 0: // 실패
      return "#ff2a2a";
    case 1:
      return "#ff7a2a";
    case 2:
      return "#ffc52a";
    case 3:
      return "#43ff2a";
    case 4:
      return "#2a89ff";
    case 5:
      return "#2c2c8a";
    case 6:
      return "#6b2aff";
    case 7:
    default:
      return "#707070";
  }
};

type WordleProps = {
  desc: string,
  tryCount: number,
  matrix: lineType[],
}

export interface WordleHistory {
  history: number[],
  checkToday: boolean,
  swagToday: boolean,
}

const WordleDescription = ({ desc, tryCount, matrix }: WordleProps) => {
  const initHistory = {
    history: [0, 0, 0, 0, 0, 0, 0, 0],
    checkToday: false,
    swagToday: false,
  };
  const [swag, setSwag] = useState(false);
  const [history, setHistory] = useState(initHistory);

  useEffect(() => {
    if ((desc === "CORRECT" || desc === "FAILED") && !history.checkToday) {
      saveHistory(desc);
    }
  }, [desc, tryCount]);

  useEffect(() => {
    if (localStorage.getItem("wordle_history")) {
      const tmpHistory = JSON.parse(localStorage.getItem("wordle_history")!);
      setHistory(() => tmpHistory);
      setSwag(tmpHistory.swagToday);
    } else {
      localStorage.setItem("wordle_history", JSON.stringify(initHistory));
    }
  }, []);

  const saveHistory = (result: string) => {
    const tmpHistory: WordleHistory = { ...history };
    if (result === "CORRECT") {
      tmpHistory.history[tryCount >= 7 ? 7 : tryCount] += 1;
    }
    if (result === "FAILED") {
      tmpHistory.history[0] += 1;
    }
    tmpHistory.checkToday = true;
    setHistory(tmpHistory);
    localStorage.setItem("wordle_history", JSON.stringify(tmpHistory));
  };

  const onSubmit = () => {
    axios.post("http://192.168.121.36:4000/api/comments", {
      "body": `[Wordle] 🙈 누군가 ${tryCount} 번 만에 성공! 🙉‍\n${createResultString(matrix, tryCount)}`,
      "date": new Date().toLocaleString(),
      "url": null,
      "type": "wordleNotice",
    })
      .then(() => {
        setSwag(true);
        const tmpHistory: WordleHistory = { ...history };
        tmpHistory.swagToday = true;
        setHistory(tmpHistory);
        localStorage.setItem("wordle_history", JSON.stringify(tmpHistory));
      });
  };

  const createResultString = (matrix: lineType[], tryCount: number) => {
    let result: string = "";
    for (let i = 0; i < tryCount; i++) {
      matrix[i].map((word) => {
        switch (word.state) {
          case "Strike":
            result += "💙";
            break;
          case "Ball":
            result += "💛";
            break;
          case "Filled":
          default:
            result += "🖤";
            break;
        }
      });
      result += "\n";
    }
    return result;
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
          <WordleHistoryButton data-tip data-for="wordleHistory">
            📜
          </WordleHistoryButton>
          <ReactTooltip id="wordleHistory" effect="solid">
            <div style={{ textAlign: "center", fontSize: "20px" }}>
              내전적
            </div>
            <WordleHistoryContainer>
              {
                history.history.map((n, idx) => (
                  <HistoryCountContainer key={idx} state={idx}>
                    <div>
                      {idx === 0 ? "실패" : idx === 7 ? idx + "+" : idx}
                    </div>
                    <div>
                      {n}
                    </div>
                  </HistoryCountContainer>
                ))
              }
            </WordleHistoryContainer>
            <div style={{ textAlign: "right", fontSize: "5px" }}>
              *브라우저 데이터 삭제 시 초기화됩니다.
            </div>
          </ReactTooltip>
          {
            <WordleSwagButton onClick={onSubmit} swag={swag} disabled={swag}>
              {swag ? "Swagged" : "Swag"}
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