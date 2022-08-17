import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import lottie from "lottie-web";

export type PatchItem = {
  date: string,
  title: string,
  content: string,
  imgURL: string,
}

type PatchItemProps = {
  item: PatchItem,
}

const HeaderContainer = styled.div`
  display: block;
`;

const TitleContainer = styled.div`
  font-size: 1.5rem;
  font-weight: 500;
`;

const DateContainer = styled.div`
  font-size: 0.5rem;
  color: gray;
  text-align: right;
`;

const ContentContainer = styled.div`
  display: block;
  margin-bottom: 20px;
`;

const LottieContainer = styled.div`
  margin: 0 auto;
  width: 60%;
  max-width: 300px;
`;

const DescriptionContainer = styled.div`
  margin: 0 5px;
  white-space: pre-wrap;
`;

const PatchNoteItem = ({ item }: PatchItemProps) => {
  const lottieContainer = useRef(null);
  useEffect(() => {
    lottie.loadAnimation({
      container: lottieContainer.current!,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: require("../lotties/" + item.imgURL),
    });
  }, []);

  return (
    <div>
      <HeaderContainer>
        <TitleContainer>{item.title}</TitleContainer>
        <DateContainer>{item.date}</DateContainer>
      </HeaderContainer>
      <ContentContainer>
        <LottieContainer ref={lottieContainer} />
        <DescriptionContainer>
          {item.content}
        </DescriptionContainer>
      </ContentContainer>
    </div>
  );
};

export default PatchNoteItem;