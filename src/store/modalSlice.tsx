import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  value: boolean;
};

const initialState: InitialState = {
  value: true,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    showModal: state => {
      state.value = true;
    },
    hideModal: state => {
      state.value = false;
    },
  },
});

export default modalSlice;
export const { showModal, hideModal } = modalSlice.actions;