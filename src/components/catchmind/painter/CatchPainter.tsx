import React, { useRef, useState } from "react";
import styled from "styled-components";
import { SideContract, SideExpand } from "../../SideMenu";
import CanvasDraw from 'react-canvas-draw';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const CatchDrawerContainer = styled.div`
  display: block;
  min-height: 100vh;
  height: 100%;
  background: #282c34;
  padding: 2rem;
  margin-left: ${SideExpand}px;

  @media ( max-width: 767px ) {
    margin-left: ${SideContract}px;
    padding: 8px 10px;
  }
`;

const DrawerCanvasContainer = styled.div`
  display: flex;
  margin: 0 auto;
  justify-content: center;
`;

const CatchPainter = () => {
  const canvasRef = useRef(null);
  const [color, setColor] = useState("black");

  const onBrushColor = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (e.currentTarget.value === "Undo") {
      console.log(e.currentTarget.value);
      canvasRef.current?.undo();
    } else {
      console.log("Brush Color :", e.currentTarget.value);
      setColor(e.currentTarget.value);
    }
  };

  return (
    <CatchDrawerContainer>
      <DrawerCanvasContainer>
        <CanvasDraw
          ref={canvasRef}
          canvasWidth={800}
          canvasHeight={600}
          brushColor={color}
        />
        <ButtonGroup vertical>
          <Button variant="primary" onClick={onBrushColor} value="Blue">Blue</Button>
          <Button variant="secondary" onClick={onBrushColor} value="Undo">Undo</Button>
          <Button variant="success" onClick={onBrushColor} value="Green">Green</Button>
          <Button variant="warning" onClick={onBrushColor} value="Yellow">Yellow</Button>
          <Button variant="danger" onClick={onBrushColor} value="Red">Red</Button>
          <Button variant="info" onClick={onBrushColor} value="SkyBlue">SkyBlue</Button>
          <Button variant="light" onClick={onBrushColor} value="White">White</Button>
          <Button variant="dark" onClick={onBrushColor} value="Black">Black</Button>
        </ButtonGroup>
      </DrawerCanvasContainer>
    </CatchDrawerContainer>
  );
};

export default CatchPainter;