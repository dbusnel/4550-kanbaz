import { configureStore } from "@reduxjs/toolkit";
import helloReducer from "./redux/hello/helloReducer";
import counterReducer from "./redux/CounterRedux/counterReducer";
import addReducer     from "./redux/AddRedux/addReducer";
const store = configureStore({
  reducer: { helloReducer, counterReducer, addReducer }
});
export type RootState = ReturnType<typeof store.getState>;
export default store;