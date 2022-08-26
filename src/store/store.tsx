import { configureStore } from "@reduxjs/toolkit";
import modalSlice from "./modalSlice";
import commentsSlice from "./commentsSlice";
import wordleSlice from "./wordleSlice";

const store = configureStore({
  reducer: {
    modal: modalSlice.reducer,
    comments: commentsSlice.reducer,
    wordle: wordleSlice.reducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;