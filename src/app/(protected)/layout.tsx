"use client";

import { ReactNode } from "react";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { Header } from "@/components/shared/Header";

interface ProtectedLayoutProps {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-grow px-4">{children}</main>
      </div>
    </AuthGuard>
  );
}
