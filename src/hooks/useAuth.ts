import { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "@/store";
import {
  login as loginAction,
  logoutAction,
  logoutUser,
  setCredentials,
} from "@/store/slices/authSlice";
import { LoginCredentials, User } from "@/types/auth";
import { getToken } from "@/lib/auth";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, token, isAuthenticated, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      const storedToken = getToken();
      if (storedToken) {
        console.log("Token found, but not authenticated in store");
      }
    }
  }, [isAuthenticated, isLoading]);

  const loginUser = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const resultAction = await dispatch(loginAction(credentials));

        if (loginAction.fulfilled.match(resultAction)) {
          const userData = resultAction.payload as User;

          if (userData && userData.accessToken) {
            return { success: true };
          }

          return { success: false, error: "No access token received" };
        }

        return {
          success: false,
          error:
            (resultAction.payload as { message?: string })?.message ||
            "Authentication failed",
        };
      } catch (error) {
        console.error("Login error:", error);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    [dispatch]
  );

  const initAuth = useCallback(
    (userData: User) => {
      dispatch(setCredentials(userData));
    },
    [dispatch]
  );

  const logout = useCallback(async () => {
    try {
      await dispatch(logoutUser());
      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      dispatch(logoutAction());
      return {
        success: false,
        error: error instanceof Error ? error.message : "Logout failed",
      };
    }
  }, [dispatch]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login: loginUser,
    logout,
    initAuth,
  };
};
