import { configureStore } from "@reduxjs/toolkit";
import employeeReducer from "./employeeSlice";

// Load state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("employeeState");
    if (serializedState === null) {
      return undefined;
    }
    const parsedState = JSON.parse(serializedState);

    if (
      parsedState &&
      parsedState.employees &&
      Array.isArray(parsedState.employees.employees)
    ) {
      return parsedState;
    }

    return undefined;
  } catch (err) {
    console.error("Could not load state from localStorage:", err);
    return undefined;
  }
};

// Save state to localStorage
const saveState = (state: RootState) => {
  try {
    console.log("Saving state to localStorage:", state);
    const serializedState = JSON.stringify(state);
    localStorage.setItem("employeeState", serializedState);
  } catch (err) {
    console.error("Could not save state to localStorage:", err);
  }
};

// Load persisted state
const persistedState = loadState();

export const store = configureStore({
  reducer: {
    employees: employeeReducer,
  },
  preloadedState: persistedState,
});

// Subscribe to store changes and save to localStorage
// This will automatically save on every state change (add, edit, delete)
store.subscribe(() => {
  saveState(store.getState());
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
