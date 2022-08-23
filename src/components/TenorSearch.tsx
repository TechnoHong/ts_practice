import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const TenorSearchContainer = styled.div`
  display: inline-flex;
  height: 200px;
  overflow-x: scroll;
`;

const GifImage = styled.img`
  
`;

const TENOR_KEY = process.env.REACT_APP_TENOR_KEY;

const TenorSearch = ({ input, gifMode, setInput, getComments }: { input: string, gifMode: any, setInput: any, getComments: any }) => {
  const [gifs, setGifs] = useState<any[]>([]);

  useEffect(() => {
    if (input) {
      console.log(input);
      axios.get("https://tenor.googleapis.com/v2/search?q="+ input +"&key=" + TENOR_KEY + "&client_key=my_test_app&limit=8")
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
  }

  return (
    <TenorSearchContainer>
      {
        gifs &&
        gifs.map((gif, index) => (
          <GifImage key={index} onClick={() => onSubmit(gif.media_formats.gif.url)} src={gif.media_formats.gif.url}/>
        ))
      }
    </TenorSearchContainer>
  );
};

export default TenorSearch;