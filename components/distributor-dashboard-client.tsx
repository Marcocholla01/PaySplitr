"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import {
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Filter,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface PaymentRecord {
  id: string;
  recipient_name: string;
  account_number: string;
  amount: number;
  bank_code: string;
  reference: string;
  status: "pending" | "completed";
  assigned_date: string;
  payment_date: string;
}

interface DashboardStats {
  totalRecords: number;
  completedRecords: number;
  pendingRecords: number;
  totalAmount: number;
  completionRate: number;
  todayRecords: number;
}

export default function DistributorDashboardClient() {
  const [records, setRecords] = useState<PaymentRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalRecords: 0,
    completedRecords: 0,
    pendingRecords: 0,
    totalAmount: 0,
    completionRate: 0,
    todayRecords: 0,
  });
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  const fetchRecords = async () => {
    try {
      const response = await fetch("/api/distributor/records");
      if (response.ok) {
        const data = await response.json();
        setRecords(data);
        setFilteredRecords(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error("Failed to fetch records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (recordsData: PaymentRecord[]) => {
    const totalRecords = recordsData.length;
    const completedRecords = recordsData.filter(
      (r) => r.status === "completed"
    ).length;
    const pendingRecords = recordsData.filter(
      (r) => r.status === "pending"
    ).length;
    const totalAmount = recordsData.reduce(
      (sum, record) => sum + record.amount,
      0
    );
    const completionRate =
      totalRecords > 0 ? (completedRecords / totalRecords) * 100 : 0;
    const today = new Date().toISOString().split("T")[0];
    const todayRecords = recordsData.filter((r) =>
      r.payment_date?.startsWith(today)
    ).length;

    setStats({
      totalRecords,
      completedRecords,
      pendingRecords,
      totalAmount,
      completionRate,
      todayRecords,
    });
  };

  const markAsCompleted = async (recordId: string) => {
    setProcessingId(recordId);
    try {
      const response = await fetch("/api/distributor/complete-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recordId }),
      });

      if (response.ok) {
        const updatedRecords = records.map((record) =>
          record.id === recordId
            ? { ...record, status: "completed" as const }
            : record
        );
        setRecords(updatedRecords);
        setFilteredRecords(updatedRecords);
        calculateStats(updatedRecords);
      }
    } catch (error) {
      console.error("Failed to mark as completed:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const applyFilters = () => {
    let filtered = records;

    if (statusFilter !== "all") {
      filtered = filtered.filter((record) => record.status === statusFilter);
    }

    if (dateFilter !== "all") {
      const today = new Date();
      const filterDate = new Date();

      switch (dateFilter) {
        case "today":
          filtered = filtered.filter((record) =>
            record.payment_date?.startsWith(today.toISOString().split("T")[0])
          );
          break;
        case "week":
          filterDate.setDate(today.getDate() - 7);
          filtered = filtered.filter(
            (record) => new Date(record.payment_date) >= filterDate
          );
          break;
        case "month":
          filterDate.setMonth(today.getMonth() - 1);
          filtered = filtered.filter(
            (record) => new Date(record.payment_date) >= filterDate
          );
          break;
      }
    }

    setFilteredRecords(filtered);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [statusFilter, dateFilter, records]);

  const uniqueDates = [
    ...new Set(
      records.map((r) => r.payment_date?.split("T")[0]).filter(Boolean)
    ),
  ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Key Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Records
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalRecords}</div>
                <p className="text-xs text-muted-foreground">Assigned to you</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Records
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.todayRecords}</div>
                <p className="text-xs text-muted-foreground">
                  For today's date
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
          </div>

          {/* Status Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Payments
                </CardTitle>
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
                  Completed Payments
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
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                Your latest payment processing activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {records.slice(0, 5).map((record) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          record.status === "completed"
                            ? "bg-green-500"
                            : "bg-orange-500"
                        }`}
                      ></div>
                      <div>
                        <p className="font-medium">{record.recipient_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.payment_date
                            ? format(new Date(record.payment_date), "PPP")
                            : "No date"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${record.amount.toLocaleString()}
                      </p>
                      <Badge
                        variant={
                          record.status === "completed"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {record.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">Last 7 Days</SelectItem>
                      <SelectItem value="month">Last 30 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Records */}
          {isLoading ? (
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  Loading your payment records...
                </div>
              </CardContent>
            </Card>
          ) : filteredRecords.length === 0 ? (
            <Alert>
              <AlertDescription>
                No payment records found matching your filters. Try adjusting
                the filter criteria.
              </AlertDescription>
            </Alert>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>
                  Payment Records ({filteredRecords.length})
                </CardTitle>
                <CardDescription>
                  Process your assigned payment records below
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Account Number</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Bank Code</TableHead>
                      <TableHead>Payment Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRecords.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell className="font-medium">
                          {record.recipient_name}
                        </TableCell>
                        <TableCell>{record.account_number}</TableCell>
                        <TableCell>${record.amount.toLocaleString()}</TableCell>
                        <TableCell>{record.bank_code}</TableCell>
                        <TableCell>
                          {record.payment_date
                            ? format(
                                new Date(record.payment_date),
                                "MMM dd, yyyy"
                              )
                            : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              record.status === "completed"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {record.status === "completed" ? (
                              <>
                                <CheckCircle className="w-3 h-3 mr-1" />
                                Completed
                              </>
                            ) : (
                              <>
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                              </>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {record.status === "pending" ? (
                            <Button
                              size="sm"
                              onClick={() => markAsCompleted(record.id)}
                              disabled={processingId === record.id}
                            >
                              {processingId === record.id
                                ? "Processing..."
                                : "Mark Complete"}
                            </Button>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              Completed
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Payment History by Date
              </CardTitle>
              <CardDescription>
                Historical view of your payment processing activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uniqueDates.map((date) => {
                  const dateRecords = records.filter((r) =>
                    r.payment_date?.startsWith(date)
                  );
                  const completedCount = dateRecords.filter(
                    (r) => r.status === "completed"
                  ).length;
                  const totalAmount = dateRecords.reduce(
                    (sum, r) => sum + r.amount,
                    0
                  );
                  const completionRate =
                    (completedCount / dateRecords.length) * 100;

                  return (
                    <div key={date} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">
                          {format(new Date(date), "PPP")}
                        </h3>
                        <Badge
                          variant={
                            completionRate === 100 ? "default" : "secondary"
                          }
                        >
                          {completionRate.toFixed(1)}% Complete
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total Records</p>
                          <p className="font-medium">{dateRecords.length}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Completed</p>
                          <p className="font-medium">{completedCount}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Amount</p>
                          <p className="font-medium">
                            ${totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Progress value={completionRate} className="mt-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
