"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Lock } from "lucide-react";
import { LoadingLogo } from "./Logo";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    if (isLoading || isCheckingAuth) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 15;
        });
      }, 100);

      return () => clearInterval(interval);
    }
  }, [isLoading, isCheckingAuth]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCheckingAuth(false);
      setLoadingProgress(100);

      if (!isLoading && !isAuthenticated && !pathname.includes("/login")) {
        router.push(`/login?redirectTo=${pathname}`);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading || isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        </div>

        <div className="relative z-10 text-center">
          <div className="mb-8">
            <LoadingLogo
              size="xl"
              showText={true}
              className="justify-center mb-6"
              textClassName="text-center"
            />
            <p className="text-lg text-gray-600 font-medium">
              Loading your dashboard...
            </p>
          </div>

          <div className="w-80 max-w-sm mx-auto mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Authenticating
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(loadingProgress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out relative"
                style={{ width: `${loadingProgress}%` }}
              >
                <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">
            Access Denied
          </h2>
          <p className="text-red-600">Redirecting to login page...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
