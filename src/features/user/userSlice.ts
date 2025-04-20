import { createSlice } from "@reduxjs/toolkit";
// import api from "../../services/api/api";

// type UserData = {
//   name: string;
//   login: string;
// };

// type UserState = {
//   data: UserData | null;
// };

// const initialState: UserState = {
//   data: null,
// };

// export const fetchUserData = async () => {
//   let user = "";
//   await api.get("/api/user").then((response) => {
//     user = response.data;
//   });
//   console.log(user);
//   return user;
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     getUser: (state) => {
//       state.data = fetchUserData();
//     },
//   },
// });

// export const { getUser } = userSlice.actions;

// export default userSlice.reducer;

type CounterState = {
  value: number;
  counter: number;
};

const initialState: CounterState = {
  value: 0,
  counter: 0,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    increment: (state) => {
      console.log(state.value);
      state.value += 1;
    },
    decrement: (state) => {
      console.log(state.value);
      state.value -= 1;
    },
  },
});

export const { increment, decrement } = userSlice.actions;

export default userSlice.reducer;
