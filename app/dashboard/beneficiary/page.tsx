"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Plus, Package, Clock, CheckCircle2, Truck, LogOut, Building2, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

// TODO: Replace with data fetched from your backend API
// Example: const { data: requests } = useSWR('/api/requests', fetcher)
const sampleRequests = [
  {
    id: "req-1",
    title: "Winter Supplies for Shelter",
    category: "Clothing",
    quantity: 100,
    status: "approved" as const,
    urgency: "high" as const,
    createdAt: "2025-01-09",
  },
  {
    id: "req-2",
    title: "Educational Materials",
    category: "Books & Education",
    quantity: 75,
    status: "matched" as const,
    urgency: "medium" as const,
    createdAt: "2025-01-07",
  },
  {
    id: "req-3",
    title: "Medical Equipment",
    category: "Medical Supplies",
    quantity: 20,
    status: "fulfilled" as const,
    urgency: "high" as const,
    createdAt: "2025-01-03",
  },
]

const statusConfig = {
  pending: { label: "Pending Review", color: "bg-amber-100 text-amber-800", icon: Clock },
  approved: { label: "Approved", color: "bg-blue-100 text-blue-800", icon: CheckCircle2 },
  fulfilled: { label: "Fulfilled", color: "bg-emerald-100 text-emerald-800", icon: Truck },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: LogOut },
  // legacy
  matched: { label: "Matched", color: "bg-violet-100 text-violet-800", icon: Package },
}

const urgencyConfig = {
  low: { label: "Low", color: "bg-slate-100 text-slate-700" },
  medium: { label: "Medium", color: "bg-orange-100 text-orange-800" },
  high: { label: "High", color: "bg-red-100 text-red-800" },
}

type Request = {
  id: string
  title: string
  category: string
  quantity: number
  status: string
  urgency: string
  createdAt: string
}

export default function BeneficiaryDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<{ name: string; organization: string } | null>(null)
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push("/login")
          return
        }

        // Fetch profile
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
        setUser({
          name: profile?.name || "Beneficiary",
          organization: profile?.organization || profile?.name || "Organization"
        })

        // Fetch requests
        const { data: requestData } = await supabase
          .from('requests')
          .select('*')
          .eq('beneficiary_id', user.id)
          .order('created_at', { ascending: false })

        const mapped: Request[] = requestData?.map(r => ({
          id: r.id,
          title: r.title,
          category: r.category || "General",
          quantity: r.quantity,
          status: r.status,
          urgency: r.urgency,
          createdAt: format(new Date(r.created_at), 'yyyy-MM-dd')
        })) || []
        setRequests(mapped)

      } catch (error) {
        console.error("Error fetching dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])


  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved" || r.status === "matched").length,
    fulfilled: requests.filter((r) => r.status === "fulfilled").length,
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
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
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{user.organization}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome, {user.organization}!</h1>
            <p className="text-muted-foreground mt-1">Submit and track your requests for support.</p>
          </div>
          <Link href="/dashboard/beneficiary/request">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Submit Request
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="text-3xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Requests</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="text-3xl font-bold text-amber-600">{stats.pending}</div>
              <div className="text-sm text-muted-foreground">Pending Review</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="text-3xl font-bold text-blue-600">{stats.approved}</div>
              <div className="text-sm text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="text-3xl font-bold text-emerald-600">{stats.fulfilled}</div>
              <div className="text-sm text-muted-foreground">Fulfilled</div>
            </CardContent>
          </Card>
        </div>

        {/* Requests List */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Your Requests</CardTitle>
            <CardDescription>Track the status of your support requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No requests found. Create one to get help!
                </div>
              ) : (
                requests.map((request) => {
                  const status = statusConfig[request.status as keyof typeof statusConfig] || statusConfig.pending
                  const urgency = urgencyConfig[request.urgency as keyof typeof urgencyConfig] || urgencyConfig.low
                  const StatusIcon = status.icon
                  return (
                    <div
                      key={request.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-border/50 rounded-xl hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2 flex-wrap">
                          <h3 className="font-semibold text-foreground">{request.title}</h3>
                          <Badge variant="secondary" className={status.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {status.label}
                          </Badge>
                          <Badge variant="outline" className={urgency.color}>
                            {urgency.label} Priority
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span>{request.category}</span>
                          <span className="mx-2">•</span>
                          <span>{request.quantity} items needed</span>
                        </div>
                      </div>
                      <div className="mt-3 md:mt-0 text-sm text-muted-foreground">{request.createdAt}</div>
                    </div>
                  )
                }))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div >
  )
}
