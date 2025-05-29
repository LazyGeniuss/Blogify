import { createSlice } from '@reduxjs/toolkit'

export interface CounterState {
  isLoggedIn: boolean;
}

const initialState: CounterState = {
  isLoggedIn: false,
}

export const counterSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.isLoggedIn = action.payload;
    }
  },
})

export const { setLogin } = counterSlice.actions

export default counterSlice.reducer