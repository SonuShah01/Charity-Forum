"use client"

import { createClient } from "@/lib/supabase/client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ArrowRight, Package, Building2, Zap, AlertTriangle, Clock, Loader2 } from "lucide-react"

// TODO: Replace with data fetched from your backend API
// Example: const { data: requests } = useSWR('/api/requests?status=approved', fetcher)
type Request = {
  id: string
  title: string
  description: string
  category: string
  quantity: number
  urgency: "low" | "medium" | "high"
  beneficiaryName: string
  organization?: string
  status: string
}

const sampleRequests: Request[] = [
  {
    id: "req-1",
    title: "Winter Supplies for Shelter",
    description: "Need warm clothing for shelter residents including jackets, sweaters, and blankets.",
    category: "Clothing",
    quantity: 100,
    urgency: "high",
    beneficiaryName: "Sarah Manager",
    organization: "Hope Foundation",
    status: "approved",
  },
  {
    id: "req-2",
    title: "Educational Materials",
    description: "Books and supplies needed for our after-school tutoring program.",
    category: "Books & Education",
    quantity: 75,
    urgency: "medium",
    beneficiaryName: "Mike Director",
    organization: "Learning Center",
    status: "approved",
  },
]

const urgencyConfig = {
  low: { label: "Low Priority", color: "bg-gray-100 text-gray-800", icon: Clock },
  medium: { label: "Medium Priority", color: "bg-orange-100 text-orange-800", icon: AlertTriangle },
  high: { label: "High Priority", color: "bg-red-100 text-red-800", icon: Zap },
}

export default function RequestPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchRequests() {
      try {
        const { data, error } = await supabase
          .from('requests')
          .select('*, profiles(name, organization)')
          .eq('status', 'approved')

        if (error) {
          console.error("Error fetching requests:", error)
        } else {
          const mapped: Request[] = data?.map(r => ({
            id: r.id,
            title: r.title,
            description: r.description,
            category: r.category,
            quantity: r.quantity,
            urgency: r.urgency as "low" | "medium" | "high",
            beneficiaryName: r.profiles?.name || "Anonymous",
            organization: r.profiles?.organization,
            status: r.status
          })) || []
          setRequests(mapped)
        }
      } catch (err) {
        console.error("Unexpected error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchRequests()
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="font-bold text-xl">GiveHope</span>
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/track" className="text-sm text-muted-foreground hover:text-foreground">
              Track Donation
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">Current Needs</h1>
          <p className="text-muted-foreground mb-6">
            See what items are needed by beneficiaries. Your donation can make a real difference.
          </p>
          <Link href="/register?role=donor">
            <Button className="gap-2">
              <Package className="h-4 w-4" />
              Donate to Help
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : requests.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-8 pb-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No active requests</h3>
              <p className="text-muted-foreground mb-4">
                All current needs have been met! Check back later or register to submit a request.
              </p>
              <Link href="/register?role=beneficiary">
                <Button variant="outline">Register as Beneficiary</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requests.map((request) => {
              const urgency = urgencyConfig[request.urgency]
              const UrgencyIcon = urgency.icon
              return (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary">{request.category}</Badge>
                      <Badge variant="outline" className={urgency.color}>
                        <UrgencyIcon className="h-3 w-3 mr-1" />
                        {urgency.label}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">{request.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{request.description}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        {request.quantity} items needed
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {request.organization || request.beneficiaryName}
                      </span>
                    </div>
                    <Link href="/register?role=donor">
                      <Button variant="outline" className="w-full gap-2 bg-transparent">
                        Donate to Help <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
