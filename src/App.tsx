import React from "react";
import Fan from "./components/Fan";
import Comments from "./components/Comments";
import Modal from "./components/Modal";

function App() {
  return (
    <>
      <Comments/>
      <Modal/>
      <Fan/>
    </>
  );
}

export default App;