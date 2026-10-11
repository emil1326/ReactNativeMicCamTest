import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore, type PersistConfig } from 'redux-persist';
import type { Reducer } from 'redux';

import { studentReducer } from './studentSlice';

const rootReducer = combineReducers({
  student: studentReducer,
});

type StoreState = ReturnType<typeof rootReducer>;

const persistConfig: PersistConfig<StoreState> = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['student'],
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
