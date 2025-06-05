"use client";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { HeaderLogo } from "./Logo";

export const Header = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await logout();

      if (result.success) {
        router.push("/login");
      } else {
        console.error("Logout failed:", result.error);
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <HeaderLogo size="md" />

          {user && (
            <div className="flex items-center space-x-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-all duration-200 group"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center border-2 border-white shadow-md group-hover:shadow-lg transition-shadow duration-200">
                        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {user.firstName.charAt(0)}
                          {user.lastName.charAt(0)}
                        </span>
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="font-semibold text-gray-900 text-sm">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500">@{user.username}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-2">
                  <DropdownMenuLabel className="px-2 py-2">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    disabled={isLoggingOut}
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-2 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
