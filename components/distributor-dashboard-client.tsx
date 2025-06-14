"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, Clock, DollarSign, Users } from "lucide-react"

interface PaymentRecord {
  id: string
  recipient_name: string
  account_number: string
  amount: number
  bank_code: string
  reference: string
  status: "pending" | "completed"
  assigned_date: string
}

export default function DistributorDashboardClient() {
  const [records, setRecords] = useState<PaymentRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)

  const fetchRecords = async () => {
    try {
      const response = await fetch("/api/distributor/records")
      if (response.ok) {
        const data = await response.json()
        setRecords(data)
      }
    } catch (error) {
      console.error("Failed to fetch records:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const markAsCompleted = async (recordId: string) => {
    setProcessingId(recordId)
    try {
      const response = await fetch("/api/distributor/complete-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recordId }),
      })

      if (response.ok) {
        setRecords(
          records.map((record) => (record.id === recordId ? { ...record, status: "completed" as const } : record)),
        )
      }
    } catch (error) {
      console.error("Failed to mark as completed:", error)
    } finally {
      setProcessingId(null)
    }
  }

  const pendingRecords = records.filter((r) => r.status === "pending")
  const completedRecords = records.filter((r) => r.status === "completed")
  const totalAmount = records.reduce((sum, record) => sum + record.amount, 0)

  useEffect(() => {
    fetchRecords()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Distributor Dashboard</h1>
              <p className="text-gray-600">Your assigned payment records</p>
            </div>
            <Badge variant="outline">Distributor</Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{records.length}</div>
              <p className="text-xs text-muted-foreground">Assigned to you</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingRecords.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting processing</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Total payment value</p>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">Loading your payment records...</div>
            </CardContent>
          </Card>
        ) : records.length === 0 ? (
          <Alert>
            <AlertDescription>
              No payment records assigned yet. Please check back later or contact your administrator.
            </AlertDescription>
          </Alert>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Payment Records</CardTitle>
              <CardDescription>Process your assigned payment records below</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Recipient</TableHead>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Bank Code</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.recipient_name}</TableCell>
                      <TableCell>{record.account_number}</TableCell>
                      <TableCell>${record.amount.toLocaleString()}</TableCell>
                      <TableCell>{record.bank_code}</TableCell>
                      <TableCell>{record.reference}</TableCell>
                      <TableCell>
                        <Badge variant={record.status === "completed" ? "default" : "secondary"}>
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
                            {processingId === record.id ? "Processing..." : "Mark Complete"}
                          </Button>
                        ) : (
                          <span className="text-sm text-muted-foreground">Completed</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
