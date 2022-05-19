import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import youtubeReducer from '../features/youtube/youtubeSlice';

export const store = configureStore({
  reducer: {
    youtube: youtubeReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;