import { configureStore } from '@reduxjs/toolkit';
import sliceReducer from './slice';

const store = configureStore({
  reducer: {
    common: sliceReducer,
  },
});

export default store;
