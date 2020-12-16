import { configureStore } from '@reduxjs/toolkit';
import { simulationSlice } from './simulation/simulationSlice';

export const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: {
    simulation: simulationSlice.reducer,
  },
});
