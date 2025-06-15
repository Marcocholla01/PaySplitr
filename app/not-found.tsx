"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Compass,
  FileQuestion,
  Home,
  Search,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Header */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">PaySplitr</span>
        </div>
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-[120px] md:text-[180px] font-bold text-gray-200 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-full p-6 shadow-lg border">
              <FileQuestion className="h-16 w-16 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <Badge variant="secondary" className="text-sm">
            Page Not Found
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Oops! This page seems to have wandered off
          </h1>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved to a
            different location.
          </p>
        </div>
        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 rounded-full p-3 w-fit mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Go Home</h3>
              <p className="text-sm text-gray-600 mb-4">
                Return to the main dashboard
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
              <div className="bg-green-100 rounded-full p-3 w-fit mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                <ArrowLeft className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Go Back</h3>
              <p className="text-sm text-gray-600 mb-4">
                Return to the previous page
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => router.back()}
              >
                Go back
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer group">
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 rounded-full p-3 w-fit mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                <Compass className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Explore</h3>
              <p className="text-sm text-gray-600 mb-4">
                Browse available features
              </p>
              <Link href="/auth/signin">
                <Button variant="outline" size="sm" className="w-full">
                  Sign in
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        {/* Help Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <Search className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">
                Still can't find what you're looking for?
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              If you believe this is an error or need assistance, please contact
              our support team.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" size="sm">
                Contact Support
              </Button>
              <Button variant="outline" size="sm">
                View Documentation
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Footer */}
        <div className="text-sm text-gray-500 pt-8">
          <p>Error Code: 404 | Page Not Found</p>
          <p className="mt-1">© 2024 PaySplitr. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
