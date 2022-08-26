import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  value: boolean;
};

const initialState: InitialState = {
  value: false,
};

const wordleSlice = createSlice({
  name: "wordle",
  initialState,
  reducers: {
    showWordle: state => {
      state.value = true;
    },
    hideWordle: state => {
      state.value = false;
    },
  },
});

export default wordleSlice;
export const { showWordle, hideWordle } = wordleSlice.actions;