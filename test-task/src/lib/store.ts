import { configureStore } from '@reduxjs/toolkit';
import jokesReducer from './features/jokes/JokesSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      jokes: jokesReducer, 
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
