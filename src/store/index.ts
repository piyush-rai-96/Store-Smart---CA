import { configureStore } from '@reduxjs/toolkit';

// Create a basic Redux store
// Impact UI requires Redux Provider to be present
export const store = configureStore({
  reducer: {
    // Add reducers here as needed
    // For now, we just need an empty store for Impact UI to work
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
