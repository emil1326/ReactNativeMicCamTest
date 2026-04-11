import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { createTransform, persistReducer, persistStore, type PersistConfig } from 'redux-persist';
import type { Reducer } from 'redux';

import { studentReducer } from './studentSlice';

const rootReducer = combineReducers({
  student: studentReducer,
});

type StoreState = ReturnType<typeof rootReducer>;

const studentTransform = createTransform(
  (inboundState) => inboundState,
  (outboundState) => {
    if (!outboundState || typeof outboundState !== 'object') {
      return outboundState;
    }

    const { password: _password, ...student } = outboundState as Record<string, unknown>;

    return student;
  },
  { whitelist: ['student'] },
);

const persistConfig: PersistConfig<StoreState> = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['student'],
  transforms: [studentTransform],
};

const persistedReducer = persistReducer(persistConfig, rootReducer as Reducer<StoreState>);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/FLUSH', 'persist/PAUSE', 'persist/PURGE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);

export type AppStore = typeof store;
export type RootState = StoreState;
export type AppDispatch = AppStore['dispatch'];
