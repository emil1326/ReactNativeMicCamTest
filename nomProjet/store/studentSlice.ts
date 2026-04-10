import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type StudentState = {
  name: string;
  password: string;
  image: string | null;
  voice: string | null;
  color: string;
  isConnected: boolean;
};

export type StudentUpdate = Partial<StudentState>;

const initialState: StudentState = {
  name: '',
  password: '',
  image: null,
  voice: null,
  color: '#f8fafc',
  isConnected: false,
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    setStudent(state, action: PayloadAction<StudentUpdate>) {
      Object.assign(state, action.payload);
    },
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setPassword(state, action: PayloadAction<string>) {
      state.password = action.payload;
    },
    setImage(state, action: PayloadAction<string | null>) {
      state.image = action.payload;
    },
    setVoice(state, action: PayloadAction<string | null>) {
      state.voice = action.payload;
    },
    setColor(state, action: PayloadAction<string>) {
      state.color = action.payload;
    },
    setConnected(state, action: PayloadAction<boolean>) {
      state.isConnected = action.payload;
    },
    resetStudent() {
      return initialState;
    },
  },
});

export const {
  resetStudent,
  setColor,
  setConnected,
  setImage,
  setName,
  setPassword,
  setStudent,
  setVoice,
} = studentSlice.actions;

export const studentReducer = studentSlice.reducer;
