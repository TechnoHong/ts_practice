import styled from "styled-components";

export const ModalBackgroundContainer = styled.div<{ isShow: boolean }>`
  position: fixed;
  display: ${props => props.isShow ? `flex` : "none"};
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  z-index: 99;
  animation: FadeIn 250ms linear;

  @keyframes FadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;