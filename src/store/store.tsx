import { configureStore } from "@reduxjs/toolkit";
import modalSlice from "./modalSlice";
import commentsSlice from "./commentsSlice";

const store = configureStore({
  reducer: {
    modal: modalSlice.reducer,
    comments: commentsSlice.reducer,
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;