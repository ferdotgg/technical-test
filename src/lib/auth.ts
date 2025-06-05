import { LoginCredentials, User } from "@/types/auth";
import Cookies from "js-cookie";

export async function login(credentials: LoginCredentials): Promise<User> {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Authentication failed");
    }

    const userData = await response.json();

    if (userData.accessToken && typeof window !== "undefined") {
      localStorage.setItem("token", userData.accessToken);
    }

    return userData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Login failed: ${error.message}`);
    }
    throw new Error("Login failed: Unknown error");
  }
}

export async function logoutApi(): Promise<{ success: boolean }> {
  try {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Logout failed");
    }

    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    Cookies.remove("token", { path: "/" });

    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    throw error;
  }
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || Cookies.get("token") || null;
  }
  return null;
}

export function saveToken(token: string): void {
  Cookies.set("token", token, {
    path: "/",
    expires: 1,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

export function removeToken(): void {
  Cookies.remove("token", { path: "/" });

  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}
