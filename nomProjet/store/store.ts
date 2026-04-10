import { configureStore } from '@reduxjs/toolkit';

import { studentReducer } from './studentSlice';

export const store = configureStore({
  reducer: {
    student: studentReducer,
  },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
