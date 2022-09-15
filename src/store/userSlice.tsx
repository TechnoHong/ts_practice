import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface UserState {
  userData: {
    username: string;
    thumbnail: string;
  };
  logged: boolean;
  validated: boolean;
}

const initialState: UserState = {
  userData: {
    username: "",
    thumbnail: "",
  },
  logged: false,
  validated: false,
};

export const postLogin = createAsyncThunk("auth/login", async (arg: any, thunkAPI) => {
  try {
    const { data } = await axios.post("http://192.168.121.36:4000/api/auth/login", arg);
    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue({ errorMessage: "Error" });
  }
});

export const postRegister = createAsyncThunk("auth/register", async (arg: any, thunkAPI) => {
  try {
    const { data } = await axios.post("http://192.168.121.36:4000/api/auth/register", arg);
    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue({ errorMessage: "Error" });
  }
});

export const checkExistName = createAsyncThunk("auth/checkName", async (arg: any, thunkAPI) => {
  try {
    const { data } = await axios.get("http://192.168.121.36:4000/api/auth/exists/username/" + arg);
    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue({ errorMessage: "Error" });
  }
});

export const checkLogin = createAsyncThunk("auth/checkLogin", async (arg, thunkAPI) => {
  try {
    const { data } = await axios.get("http://192.168.121.36:4000/api/auth/check");
    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue({ errorMessage: "Error" });
  }
});

export const postLogout = createAsyncThunk("auth/logout", async (arg, thunkAPI) => {
  try {
    const { data } = await axios.post("http://192.168.121.36:4000/api/auth/logout");
    return data;
  } catch (e) {
    return thunkAPI.rejectWithValue({ errorMessage: "Error" });
  }
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(postLogin.pending, (state) => {
        console.log("pending");
      })
      .addCase(postLogin.rejected, (state) => {
        console.log("rejected");
      })
      .addCase(postLogin.fulfilled, (state, { payload }) => {
        console.log("fulfilled", payload);
        state.userData = payload;
        state.logged = true;
      })
      .addCase(checkExistName.pending, (state) => {
        console.log("pending");
      })
      .addCase(checkExistName.rejected, (state) => {
        console.log("rejected");
      })
      .addCase(checkExistName.fulfilled, (state, { payload }) => {
        console.log("fulfilled", payload);
      })
      .addCase(postRegister.pending, (state) => {
        console.log("pending");
      })
      .addCase(postRegister.rejected, (state) => {
        console.log("rejected");
      })
      .addCase(postRegister.fulfilled, (state, { payload }) => {
        console.log("fulfilled", payload);
        state.userData = payload;
        state.logged = true;
      })
      .addCase(checkLogin.pending, (state) => {
        console.log("pending");
      })
      .addCase(checkLogin.rejected, (state) => {
        console.log("rejected");
      })
      .addCase(checkLogin.fulfilled, (state, { payload }) => {
        console.log("fulfilled", payload);
        state.validated = true;
      })
      .addCase(postLogout.pending, (state) => {
        console.log("pending");
      })
      .addCase(postLogout.rejected, (state) => {
        console.log("rejected");
      })
      .addCase(postLogout.fulfilled, (state, { payload }) => {
        console.log("fulfilled", payload);
      });
  },
});

export default userSlice;
// export const { } = userSlice.actions;