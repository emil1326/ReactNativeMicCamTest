import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { createStudent, type Student } from '../types/student';

const initialState = createStudent();

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudent(_state, action: PayloadAction<Student>) {
      return action.payload;
    },
    resetStudent() {
      return initialState;
    },
  },
});

export const {
  resetStudent,
  setStudent,
} = studentSlice.actions;

export const studentReducer = studentSlice.reducer;
