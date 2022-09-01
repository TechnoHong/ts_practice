import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { hideWordle } from "../../store/wordleSlice";
import ReactTooltip from "react-tooltip";
import WordleDescription, { WordleHistory } from "./WordleDescription";

const OWLBOT_KEY = process.env.REACT_APP_OWLBOT_KEY;
const WORDLE_KEY: string = process.env.REACT_APP_TODAY_WORDLE_KEY!;

interface LocalStorageValue {
  matrix: lineType[],
  cursor: number[],
  state: string,
  timestamp: Date,
}

interface wordType {
  word: string,
  state: WordStateType,
  isCursor: boolean,
}

type WordStateType = "Nothing" | "Filled" | "Ball" | "Strike";
export type lineType = wordType[];

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

const WordleTitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1rem;

  .title {
    font-size: 2rem;
    font-weight: 800;
    color: #C9CACC;
  }

  .guide {
    font-weight: 600;
    text-decoration: underline;
    background: transparent;
    color: #C9CACC;
    border: 0;
  }
`;

const WordleContentContainer = styled.div`
  display: block;
  background: #282c34;
  margin: 0 auto;
  border-radius: 1rem;
  padding: 1rem 3rem;
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

const handlerColorType = (state: WordStateType) => {
  switch (state) {
    case "Filled":
      return "#C9CACC";
    case "Ball":
      return "#E8E346";
    case "Strike":
      return "#4679e8";
    case "Nothing":
    default:
      return "transparent";
  }
};

const WordleAlphabetContainer = styled.span<{ wordState: WordStateType, isCursor: boolean }>`
  display: inline-block;
  font-size: 3rem;
  font-weight: 600;
  text-align: center;
  color: #282C34;
  vertical-align: middle;
  width: 60px;
  height: 80px;
  line-height: 80px;
  border: #43464D 3px solid;
  border-radius: 5px;
  ${props => props.isCursor && "border-bottom: white 3px solid"};
  background-color: ${props => handlerColorType(props.wordState)};
  transition: background-color 500ms linear;

  & + & {
    margin-left: 0.25rem;
  }
`;

const Wordle = () => {
  const initWord: wordType = {
    word: "",
    state: "Nothing",
    isCursor: false,
  };
  const initLine: lineType = [];
  const initMatrix: lineType[] = [];

  const initialWordle = () => {
    for (let i = 0; i < WORDLE_KEY.length; i++) {
      const copyLine = [...initLine];
      for (let j = 0; j < WORDLE_KEY.length; j++) {
        const copyWord = { ...initWord };
        copyLine.push(copyWord);
      }
      initMatrix.push(copyLine);
    }
    matrix[0][0].isCursor = true;
  };

  useEffect(() => {
    if (localStorage.getItem("wordle_info")) {
      const localValue: LocalStorageValue = JSON.parse(localStorage.getItem("wordle_info")!);
      if (checkPlayDate(localValue.timestamp)) {
        setMatrix(localValue.matrix);
        setCursorPos(localValue.cursor);
        setDesc(localValue.state);
      } else {
        localStorage.removeItem("wordle_info");
        historyCheck();
        initialWordle();
      }
    } else {
      initialWordle();
    }
  }, []);

  const wordle = useSelector((state: RootState) => {
    return state.wordle.value;
  });
  const dispatch = useDispatch();
  const [matrix, setMatrix] = useState(initMatrix);
  const [cursorPos, setCursorPos] = useState([0, 0]);
  const [desc, setDesc] = useState("");

  const onClose = () => {
    dispatch(hideWordle());
  };

  const checkPlayDate = (savedTime: Date) => {
    const today = new Date().getDate();
    const lastPlayDay = new Date(savedTime).getDate();
    return today === lastPlayDay;
  };

  const historyCheck = () => {
    if (localStorage.getItem("wordle_history")) {
      const history: WordleHistory = JSON.parse(localStorage.getItem("wordle_history")!);
      history.checkToday = false;
      history.swagToday = false;
      localStorage.setItem("wordle_history", JSON.stringify(history));
    }
  }

  const isValidWord = (word: string) => {
    axios.get("https://still-castle-98164.herokuapp.com/https://owlbot.info/api/v4/dictionary/" + word, {
      headers: {
        "Authorization": "Token " + OWLBOT_KEY,
      },
    })
      .then(() => {
        setDesc(() => "");
        checkWord(word).then(isCorrect => {
          if (!isCorrect) {
            if (cursorPos[0] === matrix.length - 1) { // 실패
              setDesc(() => "FAILED");
            } else {
              setCursorPos([cursorPos[0] + 1, 0]);
              matrix[cursorPos[0] + 1][0].isCursor = true;
            }
          }
        });
      })
      .catch(e => {
        if (e.response && e.response.status === 404) {
          setDesc(() => "INVALID");
        } else {
          console.log("unexpected Error");
        }
      });
  };

  const checkWord = async (word: string) => {
    matrix[cursorPos[0]].map((w, idx) => {
      if (WORDLE_KEY.at(idx) === w.word) {
        w.state = "Strike";
      } else if (WORDLE_KEY.includes(w.word)) {
        w.state = "Ball";
      }
    });
    return isCorrect(word);
  };

  const lineLoop = () => {
    const lineArr = [];
    for (let i = 0; i < matrix.length; i++) {
      lineArr.push(<WordleWordContainer key={i}>{wordLoop(i)}</WordleWordContainer>);
    }
    return lineArr;
  };

  const wordLoop = (line: number) => {
    const wordArr = [];
    for (let i = 0; i < matrix[line].length; i++) {
      wordArr.push(<WordleAlphabetContainer key={i}
                                            wordState={matrix[line][i].state}
                                            isCursor={matrix[line][i].isCursor}>
        {matrix[line][i].word}
      </WordleAlphabetContainer>);
    }
    return wordArr;
  };

  const getLineWord = (line: lineType) => {
    let word: string = "";
    line.map((oneWord) => word += oneWord.word);
    return word;
  };

  const isCorrect = (word: string): boolean => {
    if (word === WORDLE_KEY) {
      setDesc(() => "CORRECT");
      return true;
    } else {
      console.log("WRONG");
      return false;
    }
  };

  useEffect(() => {
    saveLocalStorage();
  }, [desc, cursorPos])

  const saveLocalStorage = () => {
    const saveValue: LocalStorageValue = {
      matrix: [...matrix],
      cursor: [cursorPos[0], cursorPos[1]],
      state: desc,
      timestamp: new Date(),
    };
    localStorage.setItem("wordle_info", JSON.stringify(saveValue));
  };

  const onKeyPress = (e: React.KeyboardEvent) => {
    const expression = /^[a-zA-Z]*$/;

    if (desc === "FAILED" || desc === "CORRECT") return;

    if (e.key === "Enter" && cursorPos[1] === matrix[0].length && desc !== "VERIFICATION") { // 엔터입력 정답제출
      setDesc(() => "VERIFICATION");
      const lineWord = getLineWord(matrix[cursorPos[0]]);
      isValidWord(lineWord); // 단어 유효성 확인
      return;
    }

    if (e.key === "Backspace" && cursorPos[1] !== 0) { // 지우기
      const copyArr = [...matrix];
      if (cursorPos[1] !== matrix[0].length) {
        copyArr[cursorPos[0]][cursorPos[1]].isCursor = false;
      }
      copyArr[cursorPos[0]][cursorPos[1] - 1].word = "";
      copyArr[cursorPos[0]][cursorPos[1] - 1].state = "Nothing";
      copyArr[cursorPos[0]][cursorPos[1] - 1].isCursor = true;
      setCursorPos([cursorPos[0], cursorPos[1] - 1]);
      setMatrix(copyArr);
      return;
    }

    if (!(expression.test(e.key) && (e.key.length === 1) && (cursorPos[1] < matrix[0].length))) {
      console.log("Invalid Input", e.key, cursorPos[1], matrix[0].length);
      return;
    } else { // 한줄 입력
      const copyArr = [...matrix];
      copyArr[cursorPos[0]][cursorPos[1]].isCursor = false;
      copyArr[cursorPos[0]][cursorPos[1]].word = e.key.toUpperCase();
      copyArr[cursorPos[0]][cursorPos[1]].state = "Filled";
      setCursorPos([cursorPos[0], cursorPos[1] + 1]);

      if (cursorPos[1] !== matrix[0].length - 1) {
        copyArr[cursorPos[0]][cursorPos[1] + 1].isCursor = true;
      }
      setMatrix(copyArr);
      return;
    }
  };

  return (
    <WordleBackgroundContainer isShow={wordle} onClick={onClose}>
      <WordleContentContainer onClick={e => e.stopPropagation()} onKeyDown={onKeyPress} tabIndex={0}>
        <WordleTitleContainer>
          <div className="title">WORDLE</div>
          <button className="guide" data-tip data-for="wordleGuide">HOW TO</button>
          <ReactTooltip id="wordleGuide" effect="solid" place="bottom">
            <div>⚾️ 영어 단어 맞추기 게임</div>
            <div>⚾️ 각 시행마다 온전한 n글자 단어를 제출 [Enter]</div>
            <div>⚾️ 정답 단어는 24시간마다 갱신</div>
            <div style={{ color: "#4679e8" }}>파란색: 알파벳 종류와 위치가 모두 일치 🎯</div>
            <div style={{ color: "#E8E346" }}>노란색: 위치만 불일치</div>
            <div style={{ color: "#C9CACC" }}>회색: 정답 단어에 없는 알파벳</div>
            <div style={{ fontSize: "0.25rem", textAlign: "right" }}>[출처] https://ko.wikipedia.org/wiki/워들</div>
          </ReactTooltip>
        </WordleTitleContainer>
        <WordleMainContent>
          {lineLoop()}
        </WordleMainContent>
        <WordleDescription desc={desc} tryCount={cursorPos[0] + 1} matrix={matrix} />
      </WordleContentContainer>
    </WordleBackgroundContainer>
  );
};

export default Wordle;