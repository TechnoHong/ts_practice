import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "./TenorScrollbar.css";

type scrollVisibilityApiType = React.ContextType<typeof VisibilityContext>;

const TENOR_KEY = process.env.REACT_APP_TENOR_KEY;

const TenorSearchContainer = styled.div`
  display: block;
  background: #20232a;
`;

const TenorCategoryButton = styled.button`
  background: transparent;
  border-radius: 9999px;
  padding: 2px 8px;
  margin: 5px;
  white-space: nowrap;
  color: white;

  &:hover {
    cursor: pointer;
  }
`;

const TenorGifContainer = styled(ScrollMenu)`
  width: 100%;
`;

const GifImage = styled.img`
  height: 150px;

  &:hover {
    cursor: pointer;
  }
`;

const TenorSearch = ({
                       input,
                       gifMode,
                       setInput,
                       getComments,
                     }: { input: string, gifMode: any, setInput: any, getComments: any }) => {
  const [gifs, setGifs] = useState<any[]>([]);

  useEffect(() => {
    if (input) {
      axios.get("https://tenor.googleapis.com/v2/search?q=" + input + "&key=" + TENOR_KEY + "&client_key=my_test_app&limit=8")
        .then((response) => {
          setGifs(response.data.results);
        });
    } else {
      axios.get("https://tenor.googleapis.com/v2/featured?key=" + TENOR_KEY + "&client_key=my_test_app&limit=8")
        .then((response) => {
          setGifs(response.data.results);
        });
    }
  }, [input]);

  const onSubmit = (url: string) => {
    axios.post("http://192.168.121.36:4000/api/comments", {
      "body": null,
      "date": new Date().toLocaleString(),
      "url": url,
    })
      .then(() => {
        gifMode(false);
        setInput("");
        getComments();
      });
  };

  const onClickCategory = (value: string | null) => {
    setInput("$" + value);
  };

  return (
    <TenorSearchContainer>
      <ScrollMenu onWheel={onWheel}>
        <TenorCategoryButton onClick={() => onClickCategory("")}>🔥 featured</TenorCategoryButton>
        <TenorCategoryButton onClick={() => onClickCategory("cool")}>😎 멋져요</TenorCategoryButton>
        <TenorCategoryButton onClick={() => onClickCategory("hiphop")}>✌️ 힙합</TenorCategoryButton>
        <TenorCategoryButton onClick={() => onClickCategory("pepe")}>🐸 개구리</TenorCategoryButton>
        <TenorCategoryButton onClick={() => onClickCategory("Patrick")}>🍦 뚱이</TenorCategoryButton>
        <TenorCategoryButton onClick={() => onClickCategory("SpongeBob")}>🧽️ 스펀지밥</TenorCategoryButton>
        <TenorCategoryButton onClick={() => onClickCategory("leave")}>🏡 퇴근</TenorCategoryButton>
      </ScrollMenu>
      <TenorGifContainer onWheel={onWheel}>
        {
          gifs &&
          gifs.map((gif, index) => (
            <GifImage key={index} onClick={() => onSubmit(gif.media_formats.gif.url)} src={gif.media_formats.gif.url} />
          ))
        }
      </TenorGifContainer>
    </TenorSearchContainer>
  );
};

function onWheel(apiObj: scrollVisibilityApiType, ev: React.WheelEvent): void {
  const isTouchPad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

  if (isTouchPad) {
    ev.stopPropagation();
    return;
  }

  if (ev.deltaY < 0) {
    apiObj.scrollNext();
  } else if (ev.deltaY > 0) {
    apiObj.scrollPrev();
  }
}

export default TenorSearch;