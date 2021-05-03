import { CurrentUserSliceState } from './userSliceState';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SetCurrentUserActionPayload } from './actionPayloads/SetCurrentUserActionPayload';

const initialState: CurrentUserSliceState = { username: null, email: null };

export const userSlice = createSlice({
  name: 'currentUser',
  initialState,
  reducers: {
    setCurrentUser: (
      state,
      { payload }: PayloadAction<SetCurrentUserActionPayload>
    ) => {
      state.username = payload.username;
      state.email = payload.email;
    },
    removeCurrentUser: (state) => {
      state.username = null;
      state.email = null;
    },
  },
});
