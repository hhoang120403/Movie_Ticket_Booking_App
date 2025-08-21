import { configureStore } from '@reduxjs/toolkit';
import adminReducer from './admin/adminSlice';
import favoritesReducer from './favorites/favoritesSlice';
import showsReducer from './shows/showsSlice';

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    favorites: favoritesReducer,
    shows: showsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
