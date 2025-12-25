"use client"

import { createClient } from "@/lib/supabase/client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, ArrowRight, Package, User, Loader2 } from "lucide-react"

// TODO: Replace with data fetched from your backend API
// Example: const { data: donations } = useSWR('/api/donations?status=approved', fetcher)
type Donation = {
  id: string
  title: string
  description: string
  category: string
  condition: "new" | "like-new" | "good" | "fair"
  quantity: number
  donorName: string
  status: string
}

const sampleDonations: Donation[] = [
  {
    id: "don-1",
    title: "Winter Clothing Collection",
    description: "Warm jackets and sweaters for winter season. Various sizes available.",
    category: "Clothing",
    condition: "good",
    quantity: 25,
    donorName: "John Doe",
    status: "approved",
  },
  {
    id: "don-2",
    title: "Children's Books Set",
    description: "Educational books for children ages 5-12, including story books and workbooks.",
    category: "Books & Education",
    condition: "like-new",
    quantity: 50,
    donorName: "Jane Smith",
    status: "approved",
  },
]

const conditionLabels = {
  new: "New",
  "like-new": "Like New",
  good: "Good",
  fair: "Fair",
}

export default function DonatePage() {
  const [donations, setDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchDonations() {
      try {
        const { data, error } = await supabase
          .from('donations')
          .select('*, profiles(name)')
          .eq('status', 'approved')

        if (error) {
          console.error("Error fetching donations:", error)
        } else {
          // Map to Donation type
          const mapped: Donation[] = data?.map(d => ({
            id: d.id,
            title: d.title,
            description: d.description,
            category: d.category,
            condition: d.condition as "new" | "like-new" | "good" | "fair",
            quantity: d.quantity,
            donorName: d.profiles?.name || "Anonymous",
            status: d.status
          })) || []
          setDonations(mapped)
        }
      } catch (err) {
        console.error("Unexpected error:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDonations()
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
          <h1 className="text-4xl font-bold text-foreground mb-4">Available Donations</h1>
          <p className="text-muted-foreground mb-6">
            Browse items available for donation. Register as a beneficiary to request these items.
          </p>
          <Link href="/register?role=donor">
            <Button className="gap-2">
              <Package className="h-4 w-4" />
              Donate Items
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : donations.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-8 pb-8 text-center">
              <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No donations available</h3>
              <p className="text-muted-foreground mb-4">Check back later or become a donor to help those in need.</p>
              <Link href="/register?role=donor">
                <Button>Become a Donor</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
              <Card key={donation.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary">{donation.category}</Badge>
                    <Badge variant="outline">{conditionLabels[donation.condition]}</Badge>
                  </div>
                  <h3 className="font-semibold text-lg text-foreground mb-2">{donation.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{donation.description}</p>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      {donation.quantity} items
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {donation.donorName}
                    </span>
                  </div>
                  <Link href="/register?role=beneficiary">
                    <Button variant="outline" className="w-full gap-2 bg-transparent">
                      Request This Item <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
