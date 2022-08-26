import React from "react";
import Fan from "./components/Fan";
import Comments from "./components/Comments";
import Modal from "./components/Modal";
import Falling from "./components/falling/Falling";
import Wordle from "./components/wordle/Wordle";

function App() {
  return (
    <>
      <Falling/>
      <Comments/>
      <Modal/>
      <Wordle/>
      <Fan/>
    </>
  );
}

export default App;