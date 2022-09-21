import React, { useEffect } from "react";
import Fan from "./components/Fan";
import Comments from "./components/Comments";
import Modal from "./components/Modal";
import Wordle from "./components/wordle/Wordle";
import SideMenu from "./components/SideMenu";
import { Route, Routes } from "react-router-dom";
import Login from "./components/login/Login";
import storage from "./lib/storage";
import { useAppDispatch } from "./hooks/reduxHooks";
import { postLogin } from "./store/userSlice";
import CatchPainter from "./components/catchmind/painter/CatchPainter";

function App() {
  const dispatch = useAppDispatch();

  const initializeUserInfo = async () => {
    const loginInfo = storage.get("loginInfo");
    if (!loginInfo) return;
    dispatch(postLogin(loginInfo));
  };

  useEffect(() => {
    initializeUserInfo();
  }, []);

  return (
    <>
      {/*<Falling/> Season Out*/}
      <SideMenu />
      <Modal />
      <div>
        <Routes>
          <Route path="/" element={<Fan />} />
          <Route path="/comments" element={<Comments />} />
          <Route path="/wordle" element={<Wordle />} />
          <Route path="/login" element={<Login />} />
          <Route path="/catch/painter" element={<CatchPainter />} />
        </Routes>
      </div>
    </>
  );
}

export default App;