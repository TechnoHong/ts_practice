import React from "react";
import Fan from "./components/Fan";
import Comments from "./components/Comments";
import Modal from "./components/Modal";
import Falling from "./components/falling/Falling";

function App() {
  return (
    <>
      <Falling/>
      <Comments/>
      <Modal/>
      <Fan/>
    </>
  );
}

export default App;