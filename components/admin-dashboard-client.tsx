"use client";

import type React from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  AlertCircle,
  BarChart3,
  CalendarIcon,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  PieChart,
  Settings,
  TrendingUp,
  Upload,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface UploadStats {
  totalRecords: number;
  distributedRecords: number;
  pendingRecords: number;
  completedRecords: number;
  lastUpload: string | null;
  totalAmount: number;
  completionRate: number;
}

interface DailyStats {
  date: string;
  totalRecords: number;
  completedRecords: number;
  totalAmount: number;
}

interface DistributorStats {
  id: string;
  name: string;
  email: string;
  assignedRecords: number;
  completedRecords: number;
  completionRate: number;
  totalAmount: number;
}

export default function AdminDashboardClient() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [stats, setStats] = useState<UploadStats>({
    totalRecords: 0,
    distributedRecords: 0,
    pendingRecords: 0,
    completedRecords: 0,
    lastUpload: null,
    totalAmount: 0,
    completionRate: 0,
  });
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [distributorStats, setDistributorStats] = useState<DistributorStats[]>(
    []
  );

  useEffect(() => {
    fetchStats();
    fetchDailyStats();
    fetchDistributorStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const fetchDailyStats = async () => {
    try {
      const response = await fetch("/api/admin/daily-stats");
      if (response.ok) {
        const data = await response.json();
        setDailyStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch daily stats:", error);
    }
  };

  const fetchDistributorStats = async () => {
    try {
      const response = await fetch("/api/admin/distributor-stats");
      if (response.ok) {
        const data = await response.json();
        setDistributorStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch distributor stats:", error);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadMessage("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("date", format(selectedDate, "yyyy-MM-dd"));

    try {
      const response = await fetch("/api/admin/upload-csv", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadMessage(
          `Successfully uploaded and distributed ${
            result.recordsProcessed
          } payment records to ${
            result.distributorsAssigned
          } distributors for ${format(selectedDate, "PPP")}.`
        );
        setFile(null);
        fetchStats();
        fetchDailyStats();
        fetchDistributorStats();
      } else {
        setUploadMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setUploadMessage("Failed to upload file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Payment Distribution Management</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Administrator</Badge>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="upload">Upload Data</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="distributors">Distributors</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Records
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalRecords.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Payment records uploaded
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Amount
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${stats.totalAmount.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Total payment value
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completion Rate
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.completionRate.toFixed(1)}%
                  </div>
                  <Progress value={stats.completionRate} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Distributors
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {distributorStats.length}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Currently active
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Status Overview */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending</CardTitle>
                  <Clock className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-600">
                    {stats.pendingRecords}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting processing
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Completed
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.completedRecords}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Successfully processed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Distributed
                  </CardTitle>
                  <Users className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {stats.distributedRecords}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Assigned to distributors
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Daily Activity</CardTitle>
                <CardDescription>
                  Payment processing activity over the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailyStats.slice(0, 7).map((day, index) => (
                    <div
                      key={day.date}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium">
                            {format(new Date(day.date), "PPP")}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {day.completedRecords} of {day.totalRecords}{" "}
                            completed
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">
                          ${day.totalAmount.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {(
                            (day.completedRecords / day.totalRecords) *
                            100
                          ).toFixed(1)}
                          %
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload Daily Payment CSV
                </CardTitle>
                <CardDescription>
                  Upload payment records for a specific date. The system will
                  automatically distribute records to distributors.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFileUpload} className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="date">Payment Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? (
                              format(selectedDate, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => date && setSelectedDate(date)}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="csv-file">CSV File</Label>
                      <Input
                        id="csv-file"
                        type="file"
                        accept=".csv"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        required
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Expected CSV Format:
                    </h4>
                    <code className="text-sm text-blue-800">
                      recipient_name, account_number, amount, bank_code,
                      reference
                    </code>
                    <p className="text-sm text-blue-700 mt-2">
                      Each row should contain payment details for one recipient.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={!file || isUploading}
                    className="w-full"
                  >
                    {isUploading ? "Processing..." : "Upload and Distribute"}
                  </Button>
                </form>

                {uploadMessage && (
                  <Alert
                    className="mt-4"
                    variant={
                      uploadMessage.includes("Error")
                        ? "destructive"
                        : "default"
                    }
                  >
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{uploadMessage}</AlertDescription>
                  </Alert>
                )}

                {stats.lastUpload && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Last upload: {new Date(stats.lastUpload).toLocaleString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Daily Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dailyStats.slice(0, 10).map((day) => (
                      <div key={day.date} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{format(new Date(day.date), "MMM dd")}</span>
                          <span>
                            {day.completedRecords}/{day.totalRecords}
                          </span>
                        </div>
                        <Progress
                          value={
                            (day.completedRecords / day.totalRecords) * 100
                          }
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Status Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Completed</span>
                      </div>
                      <span className="text-sm font-medium">
                        {stats.completedRecords}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span className="text-sm">Pending</span>
                      </div>
                      <span className="text-sm font-medium">
                        {stats.pendingRecords}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">Total</span>
                      </div>
                      <span className="text-sm font-medium">
                        {stats.totalRecords}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Historical Data</CardTitle>
                <CardDescription>
                  Payment processing history by date
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Total Records</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Completion Rate</TableHead>
                      <TableHead>Total Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyStats.map((day) => (
                      <TableRow key={day.date}>
                        <TableCell>
                          {format(new Date(day.date), "PPP")}
                        </TableCell>
                        <TableCell>{day.totalRecords}</TableCell>
                        <TableCell>{day.completedRecords}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              day.completedRecords === day.totalRecords
                                ? "default"
                                : "secondary"
                            }
                          >
                            {(
                              (day.completedRecords / day.totalRecords) *
                              100
                            ).toFixed(1)}
                            %
                          </Badge>
                        </TableCell>
                        <TableCell>
                          ${day.totalAmount.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Distributors Tab */}
          <TabsContent value="distributors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Distributor Performance</CardTitle>
                <CardDescription>
                  Overview of all distributor activities and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Distributor</TableHead>
                      <TableHead>Assigned</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Completion Rate</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {distributorStats.map((distributor) => (
                      <TableRow key={distributor.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {distributor.name}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {distributor.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{distributor.assignedRecords}</TableCell>
                        <TableCell>{distributor.completedRecords}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Progress
                              value={distributor.completionRate}
                              className="w-16"
                            />
                            <span className="text-sm">
                              {distributor.completionRate.toFixed(1)}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          ${distributor.totalAmount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              distributor.completionRate === 100
                                ? "default"
                                : "secondary"
                            }
                          >
                            {distributor.completionRate === 100
                              ? "Complete"
                              : "In Progress"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
