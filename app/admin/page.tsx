"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Heart,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  LogOut,
  Shield,
  ArrowRight,
  AlertTriangle,
  Zap,
} from "lucide-react"

const donationStatusConfig = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-800", icon: Clock },
  approved: { label: "Approved", color: "bg-blue-100 text-blue-800", icon: CheckCircle2 },
  matched: { label: "Matched", color: "bg-violet-100 text-violet-800", icon: Package },
  delivered: { label: "Delivered", color: "bg-emerald-100 text-emerald-800", icon: Truck },
}

const requestStatusConfig = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-800", icon: Clock },
  approved: { label: "Approved", color: "bg-blue-100 text-blue-800", icon: CheckCircle2 },
  matched: { label: "Matched", color: "bg-violet-100 text-violet-800", icon: Package },
  fulfilled: { label: "Fulfilled", color: "bg-emerald-100 text-emerald-800", icon: Truck },
}

const urgencyConfig = {
  low: { label: "Low", color: "bg-slate-100 text-slate-700", icon: Clock },
  medium: { label: "Medium", color: "bg-orange-100 text-orange-800", icon: AlertTriangle },
  high: { label: "High", color: "bg-red-100 text-red-800", icon: Zap },
}

export default function AdminDashboard() {
  // TODO: Fetch donations from your backend API
  const [sampleDonations, setSampleDonations] = useState([
    {
      id: "don-1",
      title: "Winter Clothing Collection",
      donorName: "John Doe",
      category: "Clothing",
      quantity: 25,
      condition: "good",
      description: "Warm jackets and sweaters for winter season",
      status: "approved" as const,
      beneficiaryName: null,
    },
    {
      id: "don-2",
      title: "Children's Books Set",
      donorName: "Jane Smith",
      category: "Books & Education",
      quantity: 50,
      condition: "like-new",
      description: "Educational books for children ages 5-12",
      status: "matched" as const,
      beneficiaryName: "Hope Foundation",
    },
  ])

  // TODO: Fetch requests from your backend API
  const sampleRequests = [
    {
      id: "req-1",
      title: "Winter Supplies for Shelter",
      beneficiaryName: "Sarah Manager",
      organization: "Hope Foundation",
      category: "Clothing",
      quantity: 100,
      description: "Need warm clothing for shelter residents",
      status: "approved" as const,
      urgency: "high" as const,
    },
    {
      id: "req-2",
      title: "Educational Materials",
      beneficiaryName: "Mike Director",
      organization: "Learning Center",
      category: "Books & Education",
      quantity: 75,
      description: "Books and supplies for after-school program",
      status: "pending" as const,
      urgency: "medium" as const,
    },
  ]

  // TODO: Fetch users from your backend API
  const sampleUsers = [
    { id: "1", name: "John Doe", email: "john@example.com", role: "donor" as const, createdAt: "2025-01-01" },
    {
      id: "2",
      name: "Sarah Manager",
      email: "sarah@hopefoundation.org",
      role: "beneficiary" as const,
      organization: "Hope Foundation",
      createdAt: "2025-01-02",
    },
    { id: "3", name: "Admin User", email: "admin@givehope.org", role: "admin" as const, createdAt: "2024-12-01" },
  ]

  // TODO: Fetch admin user from your backend/session
  const user = { name: "Admin User" }

  const stats = {
    totalDonations: sampleDonations.length,
    pendingDonations: sampleDonations.filter((d) => d.status === "pending").length,
    totalRequests: sampleRequests.length,
    pendingRequests: sampleRequests.filter((r) => r.status === "pending").length,
    totalUsers: sampleUsers.length,
    deliveredDonations: sampleDonations.filter((d) => d.status === "delivered").length,
  }

  const approvedDonations = sampleDonations.filter((d) => d.status === "approved")
  const approvedRequests = sampleRequests.filter((r) => r.status === "approved")

  // TODO: Add logout handler that calls your backend
  const handleLogout = () => {
    // await fetch('/api/auth/logout', { method: 'POST' })
    window.location.href = "/"
  }

  // TODO: Implement status update API call
  const handleStatusChange = async (type: "donation" | "request", id: string, newStatus: string) => {
    // await fetch(`/api/${type}s/${id}`, {
    //   method: 'PATCH',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ status: newStatus })
    // })
    console.log(`Update ${type} ${id} to status: ${newStatus}`)
  }

  // TODO: Implement matching API call
  const handleMatch = async (donationId: string, requestId: string) => {
    // await fetch('/api/match', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ donationId, requestId })
    // })
    console.log(`Match donation ${donationId} with request ${requestId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="font-bold text-xl">GiveHope</span>
            <Badge variant="secondary" className="ml-2 bg-violet-100 text-violet-800">
              <Shield className="h-3 w-3 mr-1" />
              Admin
            </Badge>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.name}</span>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage donations, requests, and oversee distribution.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{stats.totalDonations}</div>
              <div className="text-xs text-muted-foreground">Total Donations</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-amber-600">{stats.pendingDonations}</div>
              <div className="text-xs text-muted-foreground">Pending Donations</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-foreground">{stats.totalRequests}</div>
              <div className="text-xs text-muted-foreground">Total Requests</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-amber-600">{stats.pendingRequests}</div>
              <div className="text-xs text-muted-foreground">Pending Requests</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
              <div className="text-xs text-muted-foreground">Total Users</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-emerald-600">{stats.deliveredDonations}</div>
              <div className="text-xs text-muted-foreground">Delivered</div>
            </CardContent>
          </Card>
        </div>

        {/* Matching Section */}
        {approvedDonations.length > 0 && approvedRequests.length > 0 && (
          <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="h-5 w-5 text-primary" />
                Match Donations with Requests
              </CardTitle>
              <CardDescription>Connect approved donations with approved requests in the same category.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                    Available Donations
                  </h4>
                  <div className="space-y-2">
                    {approvedDonations.map((donation) => (
                      <div key={donation.id} className="p-4 border border-border/50 rounded-xl bg-background">
                        <div className="font-medium text-sm">{donation.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {donation.category} - {donation.quantity} items
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-3 text-sm text-muted-foreground uppercase tracking-wide">
                    Pending Requests
                  </h4>
                  <div className="space-y-2">
                    {approvedRequests.map((request) => {
                      const matchingDonation = approvedDonations.find((d) => d.category === request.category)
                      return (
                        <div key={request.id} className="p-4 border border-border/50 rounded-xl bg-background">
                          <div className="font-medium text-sm">{request.title}</div>
                          <div className="text-xs text-muted-foreground mb-3">
                            {request.category} - {request.quantity} items needed
                          </div>
                          {matchingDonation ? (
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full bg-transparent"
                              onClick={() => handleMatch(matchingDonation.id, request.id)}
                            >
                              Match with "{matchingDonation.title}"
                            </Button>
                          ) : (
                            <div className="text-xs text-muted-foreground italic">No matching donations available</div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs for Donations, Requests, Users */}
        <Tabs defaultValue="donations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="donations">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>All Donations</CardTitle>
                <CardDescription>Review and manage donation submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleDonations.map((donation) => {
                    const status = donationStatusConfig[donation.status]
                    const StatusIcon = status.icon
                    return (
                      <div
                        key={donation.id}
                        className="flex flex-col lg:flex-row lg:items-center justify-between p-5 border border-border/50 rounded-xl gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="font-semibold text-foreground">{donation.title}</h3>
                            <Badge variant="secondary" className={status.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span>By: {donation.donorName}</span>
                            <span className="mx-2">•</span>
                            <span>{donation.category}</span>
                            <span className="mx-2">•</span>
                            <span>{donation.quantity} items</span>
                            <span className="mx-2">•</span>
                            <span className="capitalize">{donation.condition}</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{donation.description}</p>
                          {donation.beneficiaryName && (
                            <div className="text-sm text-primary mt-1 font-medium">
                              Matched with: {donation.beneficiaryName}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <Select
                            defaultValue={donation.status}
                            onValueChange={(value) => handleStatusChange("donation", donation.id, value)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="matched">Matched</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>All Requests</CardTitle>
                <CardDescription>Review and manage support requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleRequests.map((request) => {
                    const status = requestStatusConfig[request.status]
                    const urgency = urgencyConfig[request.urgency]
                    const StatusIcon = status.icon
                    const UrgencyIcon = urgency.icon
                    return (
                      <div
                        key={request.id}
                        className="flex flex-col lg:flex-row lg:items-center justify-between p-5 border border-border/50 rounded-xl gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="font-semibold text-foreground">{request.title}</h3>
                            <Badge variant="secondary" className={status.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {status.label}
                            </Badge>
                            <Badge variant="outline" className={urgency.color}>
                              <UrgencyIcon className="h-3 w-3 mr-1" />
                              {urgency.label}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span>By: {request.organization || request.beneficiaryName}</span>
                            <span className="mx-2">•</span>
                            <span>{request.category}</span>
                            <span className="mx-2">•</span>
                            <span>{request.quantity} items needed</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{request.description}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Select
                            defaultValue={request.status}
                            onValueChange={(value) => handleStatusChange("request", request.id, value)}
                          >
                            <SelectTrigger className="w-40">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="matched">Matched</SelectItem>
                              <SelectItem value="fulfilled">Fulfilled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>View registered users on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sampleUsers.map((u) => (
                    <div
                      key={u.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-border/50 rounded-xl gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold text-foreground">{u.name}</h3>
                          <Badge
                            variant="secondary"
                            className={
                              u.role === "admin"
                                ? "bg-violet-100 text-violet-800"
                                : u.role === "donor"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-emerald-100 text-emerald-800"
                            }
                          >
                            {u.role}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span>{u.email}</span>
                          {u.organization && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{u.organization}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">Joined: {u.createdAt}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
