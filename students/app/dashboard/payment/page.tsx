"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, Building, Home, Calendar, CheckCircle, Clock, XCircle, IndianRupee } from "lucide-react"

interface PaymentRecord {
  id: string
  type: "hostel" | "day_scholar"
  category: string
  amount: number
  dueDate: string
  paidDate?: string
  status: "pending" | "paid" | "overdue"
  semester: string
  academicYear: string
}

const mockPaymentRecords: PaymentRecord[] = [
  {
    id: "1",
    type: "hostel",
    category: "Tuition Fee",
    amount: 75000,
    dueDate: "2024-01-15",
    paidDate: "2024-01-10",
    status: "paid",
    semester: "5th Semester",
    academicYear: "2023-24",
  },
  {
    id: "2",
    type: "hostel",
    category: "Hostel Fee",
    amount: 45000,
    dueDate: "2024-01-15",
    paidDate: "2024-01-10",
    status: "paid",
    semester: "5th Semester",
    academicYear: "2023-24",
  },
  {
    id: "3",
    type: "hostel",
    category: "Mess Fee",
    amount: 25000,
    dueDate: "2024-06-15",
    status: "pending",
    semester: "6th Semester",
    academicYear: "2023-24",
  },
  {
    id: "4",
    type: "day_scholar",
    category: "Tuition Fee",
    amount: 75000,
    dueDate: "2024-06-15",
    status: "pending",
    semester: "6th Semester",
    academicYear: "2023-24",
  },
  {
    id: "5",
    type: "day_scholar",
    category: "Library Fee",
    amount: 5000,
    dueDate: "2024-01-15",
    status: "overdue",
    semester: "5th Semester",
    academicYear: "2023-24",
  },
]

const hostelFeeStructure = [
  { category: "Tuition Fee", amount: 75000 },
  { category: "Hostel Fee", amount: 45000 },
  { category: "Mess Fee", amount: 25000 },
  { category: "Development Fee", amount: 10000 },
  { category: "Library Fee", amount: 5000 },
]

const dayScholarFeeStructure = [
  { category: "Tuition Fee", amount: 75000 },
  { category: "Development Fee", amount: 10000 },
  { category: "Library Fee", amount: 5000 },
  { category: "Transport Fee", amount: 15000 },
]

export default function PaymentPage() {
  const [studentType, setStudentType] = useState<"hostel" | "day_scholar">("hostel")
  const [selectedFees, setSelectedFees] = useState<string[]>([])
  const [paymentMethod, setPaymentMethod] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const currentFeeStructure = studentType === "hostel" ? hostelFeeStructure : dayScholarFeeStructure
  const filteredRecords = mockPaymentRecords.filter((record) => record.type === studentType)

  const totalAmount = selectedFees.reduce((sum, feeCategory) => {
    const fee = currentFeeStructure.find((f) => f.category === feeCategory)
    return sum + (fee?.amount || 0)
  }, 0)

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setIsProcessing(true)

    if (selectedFees.length === 0) {
      setError("Please select at least one fee category")
      setIsProcessing(false)
      return
    }

    if (!paymentMethod) {
      setError("Please select a payment method")
      setIsProcessing(false)
      return
    }

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000))

      setSuccess(`Payment of ₹${totalAmount.toLocaleString()} processed successfully!`)
      setSelectedFees([])
      setPaymentMethod("")
    } catch (err) {
      setError("Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "overdue":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "overdue":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Fee Payment</h1>
          <p className="text-muted-foreground">Manage your college fee payments and view payment history</p>
        </div>

        <Tabs defaultValue="payment" className="space-y-6">
          <TabsList>
            <TabsTrigger value="payment">Make Payment</TabsTrigger>
            <TabsTrigger value="history">Payment History</TabsTrigger>
          </TabsList>

          <TabsContent value="payment" className="space-y-6">
            {/* Student Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Student Type</CardTitle>
                <CardDescription>Select your accommodation type to view applicable fees</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={studentType}
                  onValueChange={(value) => {
                    setStudentType(value as "hostel" | "day_scholar")
                    setSelectedFees([])
                  }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="hostel" id="hostel" />
                    <Label htmlFor="hostel" className="flex items-center gap-2 cursor-pointer">
                      <Building className="h-4 w-4" />
                      Hostel Student
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="day_scholar" id="day_scholar" />
                    <Label htmlFor="day_scholar" className="flex items-center gap-2 cursor-pointer">
                      <Home className="h-4 w-4" />
                      Day Scholar
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Fee Structure */}
            <Card>
              <CardHeader>
                <CardTitle>{studentType === "hostel" ? "Hostel Student" : "Day Scholar"} Fee Structure</CardTitle>
                <CardDescription>Select the fees you want to pay</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {currentFeeStructure.map((fee) => (
                    <div key={fee.category} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={fee.category}
                          checked={selectedFees.includes(fee.category)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFees([...selectedFees, fee.category])
                            } else {
                              setSelectedFees(selectedFees.filter((f) => f !== fee.category))
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <Label htmlFor={fee.category} className="font-medium cursor-pointer">
                          {fee.category}
                        </Label>
                      </div>
                      <div className="flex items-center gap-1 font-semibold">
                        <IndianRupee className="h-4 w-4" />
                        {fee.amount.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {selectedFees.length > 0 && (
                  <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Total Amount:</span>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="h-5 w-5" />
                        {totalAmount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            {selectedFees.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Choose your preferred payment method</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePayment} className="space-y-4">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer">
                          <CreditCard className="h-4 w-4" />
                          Credit/Debit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="upi" id="upi" />
                        <Label htmlFor="upi" className="cursor-pointer">
                          UPI Payment
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="netbanking" id="netbanking" />
                        <Label htmlFor="netbanking" className="cursor-pointer">
                          Net Banking
                        </Label>
                      </div>
                    </RadioGroup>

                    {success && (
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>{success}</AlertDescription>
                      </Alert>
                    )}

                    {error && (
                      <Alert variant="destructive">
                        <XCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                    <Button type="submit" disabled={isProcessing} className="w-full" size="lg">
                      {isProcessing ? "Processing Payment..." : `Pay ₹${totalAmount.toLocaleString()}`}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View your past and pending fee payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Semester</TableHead>
                        <TableHead>Paid Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell className="font-medium">{record.category}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <IndianRupee className="h-3 w-3" />
                              {record.amount.toLocaleString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1 text-sm">
                              <Calendar className="h-3 w-3" />
                              {new Date(record.dueDate).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(record.status)}
                              <Badge variant={getStatusBadgeVariant(record.status)}>{record.status}</Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{record.semester}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {record.paidDate ? new Date(record.paidDate).toLocaleDateString() : "-"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
