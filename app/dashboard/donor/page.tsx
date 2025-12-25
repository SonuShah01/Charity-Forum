"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Plus, Package, Clock, CheckCircle2, Truck, LogOut, User, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

// TODO: Replace with data fetched from your backend API
// Example: const { data: donations } = useSWR('/api/donations', fetcher)
const sampleDonations = [
  {
    id: "don-1",
    title: "Winter Clothing Collection",
    category: "Clothing",
    quantity: 25,
    condition: "good",
    status: "approved" as const,
    createdAt: "2025-01-10",
    beneficiaryName: null,
  },
  {
    id: "don-2",
    title: "Children's Books Set",
    category: "Books & Education",
    quantity: 50,
    condition: "like-new",
    status: "matched" as const,
    createdAt: "2025-01-08",
    beneficiaryName: "Hope Foundation",
  },
  {
    id: "don-3",
    title: "Kitchen Supplies",
    category: "Household Items",
    quantity: 15,
    condition: "new",
    status: "delivered" as const,
    createdAt: "2025-01-05",
    beneficiaryName: "Community Kitchen",
  },
]

const statusConfig = {
  pending: { label: "Pending Review", color: "bg-amber-100 text-amber-800", icon: Clock },
  approved: { label: "Approved", color: "bg-blue-100 text-blue-800", icon: CheckCircle2 },
  completed: { label: "Completed", color: "bg-emerald-100 text-emerald-800", icon: Truck },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-800", icon: LogOut },
  // legacy backup
  matched: { label: "Matched", color: "bg-violet-100 text-violet-800", icon: Package },
  delivered: { label: "Delivered", color: "bg-emerald-100 text-emerald-800", icon: Truck },
}

type Donation = {
  id: string
  title: string
  category: string
  quantity: number
  condition: string
  status: string
  createdAt: string
  beneficiaryName: string | null
}

export default function DonorDashboard() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<{ name: string } | null>(null)
  const [donations, setDonations] = useState<Donation[]>([])
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
        const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single()
        setUser({ name: profile?.name || "Donor" })

        // Fetch donations
        const { data: donationData } = await supabase
          .from('donations')
          .select('*')
          .eq('donor_id', user.id)
          .order('created_at', { ascending: false })

        const mapped: Donation[] = donationData?.map(d => ({
          id: d.id,
          title: d.title,
          category: d.category || "General",
          quantity: d.quantity,
          condition: d.condition,
          status: d.status,
          createdAt: format(new Date(d.created_at), 'yyyy-MM-dd'),
          beneficiaryName: null // Pending feature
        })) || []
        setDonations(mapped)

      } catch (error) {
        console.error("Error fetching dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [router])

  const stats = {
    total: donations.length,
    pending: donations.filter((d) => d.status === "pending").length,
    approved: donations.filter((d) => d.status === "approved" || d.status === "completed").length,
    delivered: donations.filter((d) => d.status === "completed").length,
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
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{user.name}</span>
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
            <h1 className="text-3xl font-bold text-foreground">Welcome back, {user.name.split(" ")[0]}!</h1>
            <p className="text-muted-foreground mt-1">Manage your donations and track their impact.</p>
          </div>
          <Link href="/dashboard/donor/donate">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Create Donation
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-border/50">
            <CardContent className="p-5">
              <div className="text-3xl font-bold text-foreground">{stats.total}</div>
              <div className="text-sm text-muted-foreground">Total Donations</div>
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
              <div className="text-3xl font-bold text-emerald-600">{stats.delivered}</div>
              <div className="text-sm text-muted-foreground">Delivered</div>
            </CardContent>
          </Card>
        </div>

        {/* Donations List */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Your Donations</CardTitle>
            <CardDescription>Track the status and impact of your contributions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {donations.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No donations found. Start by creating one!
                </div>
              ) : (
                donations.map((donation) => {
                  const status = statusConfig[donation.status as keyof typeof statusConfig] || statusConfig.pending
                  const StatusIcon = status.icon
                  return (
                    <div
                      key={donation.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-5 border border-border/50 rounded-xl hover:bg-muted/30 transition-colors"
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
                          <span>{donation.category}</span>
                          <span className="mx-2">•</span>
                          <span>{donation.quantity} items</span>
                          <span className="mx-2">•</span>
                          <span className="capitalize">{donation.condition} condition</span>
                        </div>
                        {donation.beneficiaryName && (
                          <div className="text-sm text-primary mt-1 font-medium">
                            Matched with: {donation.beneficiaryName}
                          </div>
                        )}
                      </div>
                      <div className="mt-3 md:mt-0 text-sm text-muted-foreground">{donation.createdAt}</div>
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
