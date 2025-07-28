"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Shield } from "lucide-react";

interface LoadingFallbackProps {
  message?: string;
  showLogo?: boolean;
  variant?: "default" | "minimal" | "full-page";
}

export function LoadingFallback({
  message = "Loading...",
  showLogo = true,
  variant = "default",
}: LoadingFallbackProps) {
  if (variant === "full-page") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          {showLogo && (
            <div className="flex items-center justify-center space-x-2 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                PayDistribute
              </span>
            </div>
          )}

          <div className="bg-white rounded-full p-6 shadow-lg border w-fit mx-auto">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-gray-900">{message}</h2>
            <p className="text-gray-600">
              Please wait while we prepare your dashboard...
            </p>
          </div>

          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.1s" }}
            ></div>
            <div
              className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
              style={{ animationDelay: "0.2s" }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
          <span className="text-gray-600">{message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <Card className="max-w-sm w-full">
        <CardContent className="p-6 text-center space-y-4">
          {showLogo && (
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900">PayDistribute</span>
            </div>
          )}

          <div className="space-y-3">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto" />
            <p className="text-gray-600">{message}</p>
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoadingFallback;
