import React, { useRef, useState } from "react";
import logo from "../logo.svg";
import styled from "styled-components";
import Greetings from "./Greetings";
import useInterval from "../hooks/useInterval";

const LogoContainer = styled.header`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
`;

const LogoImg = styled.img<{ speed: number }>`
  height: 300px;
  width: 300px;
  @media (prefers-reduced-motion: no-preference) {
    ${props => `animation: App-logo-spin infinite ${props.speed}ms linear`}
  }

  transition: scale 20s ease-in;

  &:hover {
    scale: 160%;
  }

  @keyframes App-logo-spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

function Fan() {
  const [duration, setDuration] = useState(20000);
  const [isHover, setIsHover] = useState<boolean>(false);
  const logoImg = useRef<any>();

  useInterval(() => {
    if (isHover) {
      setDuration(duration - 100 > 200 ? duration - 100 : 200);
    } else {
      setDuration(duration + 100 < 20000 ? duration + 100 : 20000);
    }
    logoImg.current!.style.animationDuration = `${duration}ms`;
  }, 10);

  const onHover = () => {
    setIsHover(true);
  };

  const onLeave = () => {
    setIsHover(false);
  };

  return (
    <div className="App">
      <LogoContainer>
        <LogoImg
          src={logo}
          alt="logo"
          speed={duration}
          onMouseOver={onHover}
          onMouseLeave={onLeave}
          onTouchStart={onHover}
          onTouchEnd={onLeave}
          ref={logoImg}
        />
        <Greetings name="선풍기"/>
      </LogoContainer>
    </div>
  );
}

export default Fan;
