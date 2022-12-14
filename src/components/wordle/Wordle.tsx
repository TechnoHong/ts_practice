import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import ReactTooltip from "react-tooltip";
import WordleDescription, { WordleHistory } from "./WordleDescription";
import WordleKeyPad from "./WordleKeyPad";
import { SideContract, SideExpand } from "../SideMenu";

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

const WordleTitleContainer = styled.div`
  display: flex;
  align-items: baseline;
  padding: 25px;

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
    padding: 0;
    margin-left: 5px;
  }
`;

const WordleContentContainer = styled.div`
  display: block;
  min-height: 100vh;
  height: 100%;
  background: #282c34;
  padding: 0 2rem;
  margin-left: ${SideExpand}px;

  @media ( max-width: 767px ) {
    margin-left: ${SideContract}px;
    padding: 8px 10px;
  }
`;

const WordleMainContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const WordleWordContainer = styled.div`
  margin: 0 auto;

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

  @media ( max-width: 767px ) {
    width: 10vmin;
    height: 15vmin;
    font-size: 7vmin;
    line-height: 15vmin;
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

  const [matrix, setMatrix] = useState(initMatrix);
  const [cursorPos, setCursorPos] = useState([0, 0]);
  const [desc, setDesc] = useState("");

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
  };

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
            if (cursorPos[0] === matrix.length - 1) { // ??????
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
  }, [desc, cursorPos]);

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
    inputKey(e.key);
  };

  const inputKey = (key: string) => {
    const expression = /^[a-zA-Z]*$/;

    if (desc === "FAILED" || desc === "CORRECT") return;

    if (key === "Enter" && cursorPos[1] === matrix[0].length && desc !== "VERIFICATION") { // ???????????? ????????????
      setDesc(() => "VERIFICATION");
      const lineWord = getLineWord(matrix[cursorPos[0]]);
      isValidWord(lineWord); // ?????? ????????? ??????
      return;
    }

    if (key === "Backspace" && cursorPos[1] !== 0) { // ?????????
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

    if (!(expression.test(key) && (key.length === 1) && (cursorPos[1] < matrix[0].length))) {
      console.log("Invalid Input", key, cursorPos[1], matrix[0].length);
      return;
    } else { // ?????? ??????
      const copyArr = [...matrix];
      copyArr[cursorPos[0]][cursorPos[1]].isCursor = false;
      copyArr[cursorPos[0]][cursorPos[1]].word = key.toUpperCase();
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
    <WordleContentContainer onKeyDown={onKeyPress} tabIndex={0}>
      <WordleTitleContainer>
        <div className="title">WORDLE</div>
        <button className="guide" data-tip data-for="wordleGuide">HOW TO ?</button>
        <ReactTooltip id="wordleGuide">
          <div>?????? ?????? ?????? ????????? ??????</div>
          <div>?????? ??? ???????????? ????????? n?????? ????????? ?????? [Enter]</div>
          <div>?????? ?????? ????????? 24???????????? ??????</div>
          <div style={{ color: "#4679e8" }}>?????????: ????????? ????????? ????????? ?????? ?????? ????</div>
          <div style={{ color: "#E8E346" }}>?????????: ????????? ?????????</div>
          <div style={{ color: "#C9CACC" }}>??????: ?????? ????????? ?????? ?????????</div>
          <div style={{ fontSize: "0.25rem", textAlign: "right" }}>[??????] https://ko.wikipedia.org/wiki/??????</div>
        </ReactTooltip>
      </WordleTitleContainer>
      <WordleMainContent>
        {lineLoop()}
      </WordleMainContent>
      <WordleDescription desc={desc} tryCount={cursorPos[0] + 1} matrix={matrix} />
      <WordleKeyPad inputKey={inputKey} />
    </WordleContentContainer>
  );
};

export default Wordle;