"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertTriangle,
  Bug,
  CheckCircle,
  Copy,
  Home,
  LifeBuoy,
  RefreshCw,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  const copyErrorDetails = async () => {
    const errorDetails = `
Error: ${error.message}
Digest: ${error.digest || "N/A"}
Stack: ${error.stack || "N/A"}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}
User Agent: ${navigator.userAgent}
    `.trim();

    try {
      await navigator.clipboard.writeText(errorDetails);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy error details:", err);
    }
  };

  const getErrorType = () => {
    if (error.message.includes("Network")) return "Network Error";
    if (error.message.includes("Permission")) return "Permission Error";
    if (error.message.includes("Authentication")) return "Authentication Error";
    if (error.message.includes("Database")) return "Database Error";
    return "Application Error";
  };

  const getErrorColor = () => {
    const type = getErrorType();
    if (type.includes("Network")) return "text-orange-600";
    if (type.includes("Permission")) return "text-red-600";
    if (type.includes("Authentication")) return "text-purple-600";
    if (type.includes("Database")) return "text-blue-600";
    return "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Header */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-600">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">PaySplitr</span>
        </div>

        {/* Error Illustration */}
        <div className="relative">
          <div className="bg-white rounded-full p-8 shadow-lg border border-red-200 w-fit mx-auto">
            <div className="relative">
              <AlertTriangle className="h-20 w-20 text-red-500" />
              <div className="absolute -top-2 -right-2 bg-red-100 rounded-full p-2">
                <Bug className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <Badge variant="destructive" className="text-sm">
            {getErrorType()}
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Something went wrong!
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            We encountered an unexpected error. Don't worry, our team has been
            notified and is working on a fix.
          </p>
        </div>

        {/* Error Details */}
        <Card className="bg-gray-50 border-gray-200 text-left">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Bug className="h-4 w-4" />
                Error Details
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={copyErrorDetails}
                className="text-xs"
              >
                {copied ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">Message:</span>
                <p className={`mt-1 ${getErrorColor()}`}>{error.message}</p>
              </div>
              {error.digest && (
                <div>
                  <span className="font-medium text-gray-700">Error ID:</span>
                  <p className="mt-1 text-gray-600 font-mono text-xs">
                    {error.digest}
                  </p>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">Time:</span>
                <p className="mt-1 text-gray-600">
                  {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 rounded-full p-3 w-fit mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                <RefreshCw className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Try Again</h3>
              <p className="text-sm text-gray-600 mb-4">
                Retry the failed operation
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={reset}
              >
                Retry
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 rounded-full p-3 w-fit mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                <Home className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Go Home</h3>
              <p className="text-sm text-gray-600 mb-4">
                Return to the dashboard
              </p>
              <Link href="/">
                <Button variant="outline" size="sm" className="w-full">
                  Take me home
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 rounded-full p-3 w-fit mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                <LifeBuoy className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Help</h3>
              <p className="text-sm text-gray-600 mb-4">
                Contact our support team
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Help Section */}
        <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <LifeBuoy className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-medium">Need immediate assistance?</p>
              <p className="text-sm">
                If this error persists, please copy the error details above and
                contact our support team. We're here to help you get back on
                track quickly.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <Button variant="outline" size="sm">
                  📧 Email Support
                </Button>
                <Button variant="outline" size="sm">
                  💬 Live Chat
                </Button>
                <Button variant="outline" size="sm">
                  📚 Documentation
                </Button>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        {/* Footer */}
        <div className="text-sm text-gray-500 pt-8">
          <p>Error Code: 500 | Internal Server Error</p>
          <p className="mt-1">© 2024 PaySplitr. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
