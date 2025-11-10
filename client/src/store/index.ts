import { configureStore } from "@reduxjs/toolkit";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import authReducer from './slices/auth.slice';
import visitorReducer from './slices/visitor.slice';
import dashboardReducer from './slices/dashboard.slice';
import notificationReducer from './slices/notification.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    visitor: visitorReducer,
    dashboard: dashboardReducer,
    notification: notificationReducer,
  },
  middleware: (getDefaultMiddleware) => {
    getDefaultMiddleware({
      serializableCheck: false,
    });
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
