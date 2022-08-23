import { createSlice } from "@reduxjs/toolkit";

type InitialState = {
  value: boolean;
};

const initialState: InitialState = {
  value: false,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    showComments: state => {
      state.value = true;
    },
    hideComments: state => {
      state.value = false;
    },
  },
});

export default commentsSlice;
export const { showComments, hideComments } = commentsSlice.actions;