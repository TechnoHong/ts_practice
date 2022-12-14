import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { hideModal, showModal } from "../store/modalSlice";
import axios from "axios";
import PatchNoteItem, { PatchItem } from "./PatchNoteItem";

const ModalBackgroundContainer = styled.div<{ isShow: boolean }>`
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

const ModalContentContainer = styled.div`
  display: block;
  background: white;
  margin: 0 auto;
  width: 60%;
  height: 80%;
  border-radius: 1rem;
  padding: 2rem;
  
  @media ( max-width: 767px ) {
    width: 100%;
    height: 100%;
  }
`;

const ModalHeader = styled.div`
  font-size: 2rem;
  font-weight: bold;
`;

const ModalContent = styled.div`
  height: 90%;
  overflow-y: scroll;
  overflow-wrap: break-word;
  padding-right: 5px;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: baseline;
`;

const ModalButton = styled.button`
  background: transparent;
  border: 0;
  font-weight: 700;
  margin-top: 0.5rem;

  &:hover {
    cursor: pointer;
  }
`;

const Modal = () => {
  const [patchNotes, setPatchNotes] = useState<PatchItem[]>();
  const dispatch = useDispatch();
  const modal = useSelector((state: RootState) => {
    return state.modal.value;
  });

  const current = new Date();
  const PopUpExpiresTime = localStorage.getItem("hasVisitedBefore");

  const onClose = () => {
    dispatch(hideModal());
  };

  const onCloseOneDay = () => {
    const expires = current.setHours(current.getHours() + 24);
    localStorage.setItem("hasVisitedBefore", expires.toString());
    onClose();
  };

  useEffect(() => {
    if (PopUpExpiresTime && parseInt(PopUpExpiresTime) > current.getTime()) {
      return;
    } else {
      dispatch(showModal());
    }
  }, []);

  useEffect(() => {
    axios.get("/data/patchNote.json")
      .then((response) => {
        setPatchNotes(response.data);
      });
  }, []);

  return (
    <ModalBackgroundContainer isShow={modal} onClick={onClose}>
      <ModalContentContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          ????????????
        </ModalHeader>
        <ModalContent>
          {
            patchNotes ?
              patchNotes.map((value, index) => (
                <PatchNoteItem key={index} item={value} />
              ))
              : null
          }
        </ModalContent>
        <ModalFooter>
          <ModalButton onClick={onCloseOneDay}>
            ?????? ?????? ?????? ??????
          </ModalButton>
          <ModalButton onClick={onClose}>
            ??????
          </ModalButton>
        </ModalFooter>
      </ModalContentContainer>
    </ModalBackgroundContainer>
  );
};

export default Modal;