import { configureStore } from '@reduxjs/toolkit';
import listSlice from '../TodoList/state/listSlice';

export const AppStore = configureStore({
  reducer: { listSlice },
});

export type RootState = ReturnType<typeof AppStore.getState>;
export type AppDispatch = typeof AppStore.dispatch;
