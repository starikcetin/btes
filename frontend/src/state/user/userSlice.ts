import { CurrentUserSliceState } from './userSliceState';
import { createSlice } from '@reduxjs/toolkit';

const initialState: CurrentUserSliceState = {};

export const userSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {},
});
