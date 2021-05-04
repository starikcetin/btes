import { configureStore } from '@reduxjs/toolkit';
import { simulationSlice } from './simulation/simulationSlice';
import { userSlice } from './user/userSlice';

export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    simulation: simulationSlice.reducer,
    currentUser: userSlice.reducer,
  },
});
