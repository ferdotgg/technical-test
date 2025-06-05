import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import productReducer from "./slices/productSlice";
import authReducer from "./slices/authSlice";
import { useDispatch } from "react-redux";

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "token", "isAuthenticated"],
};

const productPersistConfig = {
  key: "products",
  storage,
  whitelist: ["products"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  products: persistReducer(productPersistConfig, productReducer),
});

const rootPersistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};
const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        ignoredPaths: ["register", "auth.user", "auth.token"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
