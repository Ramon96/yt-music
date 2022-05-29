import { configureStore, ThunkAction, Action, getDefaultMiddleware } from '@reduxjs/toolkit';
import youtubeReducer from '../features/youtube/youtubeSlice';

export const store = configureStore({
  reducer: {
    youtube: youtubeReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: false
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;