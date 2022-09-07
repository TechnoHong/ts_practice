import React from "react";
import Fan from "./components/Fan";
import Comments from "./components/Comments";
import Modal from "./components/Modal";
import Wordle from "./components/wordle/Wordle";
import SideMenu from "./components/SideMenu";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      {/*<Falling/> Season Out*/}
      <SideMenu/>
      <Modal/>
      <div>
        <Routes>
          <Route path="/" element={<Fan />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/wordle" element={<Wordle />} />
        </Routes>
      </div>
    </>
  );
}

export default App;