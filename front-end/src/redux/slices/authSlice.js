import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from "js-cookie";

// Initial state
const initialState = {
  user: null,
  token: Cookies.get("token") || null, // Get token from cookies
  loading: false,
  error: null,
};

// **Thunk for user login**
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { 
        email, 
        password 
      }, { withCredentials: true }); // Send cookies with request

      Cookies.set("token", response.data.token, { expires: 7 }); // Store token in cookies (expires in 7 days)
      return response.data; // { token, user }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Invalid credentials");
    }
  }
);

// **Thunk for user logout**
export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  Cookies.remove("token");
  return null; // Reset user state
});

// **Fetch User Info Using ID from Cookies**
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/profile", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "User not authenticated");
    }
  }
);

// **Authentication Slice**
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {}, 
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.user = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
