import React, { useState } from "react";
import styled from "styled-components";

type GreetingProps = {
  name: string,
}

const FanControlContainer = styled.div<{speed: number}>`
  display: inline-flex;
  position: fixed;
  align-items: flex-end;
  bottom: 15px;
  animation: Vibrate 10ms linear infinite;
  animation-play-state: ${props => props.speed === 0.1 ? `running` : `paused`};
  
  @keyframes Vibrate {
    0%, 50%, 100% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(1.5px, 0);
    }
    75% {
      transform: translate(-1.5px, 0);
    }
  }
`;

const ControlButton = styled.button<{isActive?: boolean}>`
  background: transparent;
  border-radius: 2px;
  border: gray 1px solid;
  border-bottom: white ${props => props.isActive ? "2px" : "6px"} solid;
  color: white;
  
  & + & {
    margin-left: 0.25rem;
  }
`;

const FanRotationControlBlock = styled.div<{ rotate: string }>`
  @media (prefers-reduced-motion: no-preference) {
    animation: FanRotation infinite 4s linear forwards;
    animation-play-state: ${props => `${props.rotate}`};
  }
  
  @keyframes FanRotation {
    0%, 50%, 100% {
      transform: rotateY(0deg);
    }
    25% {
      transform: rotateY(60deg);
    }
    75% {
      transform: rotateY(-60deg);
    }
  }
`;

const FanPowerControlBlock = styled.div<{ speed: number }>`
  @media (prefers-reduced-motion: no-preference) {
    ${props => `animation: FanPower infinite ${props.speed}ms linear`}
  }
  transition: scale 1s ease;

  &:hover {
    scale: 130%;
  }

  @keyframes FanPower {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Greetings = ({ name }: GreetingProps) => {
  const [power, setPower] = useState(0);
  const [rotate, setRotate] = useState(false);

  const onClickPower = (e: number) => {
    setPower(e);
  };

  const onClickRotation = () => {
    setRotate(!rotate);
  };

  return (
    <>
      <FanRotationControlBlock rotate={rotate ? "running" : "paused"}>
        <FanPowerControlBlock speed={power}>
          Hello, {name}
        </FanPowerControlBlock>
      </FanRotationControlBlock>

      <FanControlContainer speed={power}>
        <ControlButton onClick={() => onClickPower(0)} isActive={power === 0}>off</ControlButton>
        <ControlButton onClick={() => onClickPower(1000)} isActive={power === 1000}>1</ControlButton>
        <ControlButton onClick={() => onClickPower(500)} isActive={power === 500}>2</ControlButton>
        <ControlButton onClick={() => onClickPower(1)} isActive={power === 1}>3</ControlButton>
        <ControlButton onClick={() => onClickPower(0.1)} isActive={power === 0.1}>4</ControlButton>
        <ControlButton onClick={onClickRotation} isActive={rotate}>회전</ControlButton>
      </FanControlContainer>
    </>
  );
};

export default Greetings;