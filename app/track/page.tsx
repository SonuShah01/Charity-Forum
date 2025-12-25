"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, Search, Package, Clock, CheckCircle2, Truck, User, Building2 } from "lucide-react"

// TODO: Replace with API call to your backend
// Example: const fetchTrackingData = async (id) => {
//   const response = await fetch(`/api/track/${id}`)
//   return response.json()
// }

const donationStatusSteps = [
  {
    status: "pending",
    label: "Pending Review",
    description: "Your donation is being reviewed by our team",
    icon: Clock,
  },
  {
    status: "approved",
    label: "Approved",
    description: "Your donation has been approved and is ready for matching",
    icon: CheckCircle2,
  },
  {
    status: "matched",
    label: "Matched",
    description: "Your donation has been matched with a beneficiary",
    icon: Package,
  },
  {
    status: "delivered",
    label: "Delivered",
    description: "Your donation has been delivered successfully",
    icon: Truck,
  },
]

const requestStatusSteps = [
  {
    status: "pending",
    label: "Pending Review",
    description: "Your request is being reviewed by our team",
    icon: Clock,
  },
  {
    status: "approved",
    label: "Approved",
    description: "Your request has been approved and we're looking for matches",
    icon: CheckCircle2,
  },
  { status: "matched", label: "Matched", description: "Your request has been matched with a donation", icon: Package },
  { status: "fulfilled", label: "Fulfilled", description: "Your request has been fulfilled", icon: Truck },
]

export default function TrackPage() {
  const [trackingId, setTrackingId] = useState("")
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setResult(null)
    setSearched(true)
    setLoading(true)

    // TODO: Replace with your backend API call
    // const data = await fetchTrackingData(trackingId)
    // if (data.error) { setError(data.error) }
    // else { setResult(data) }

    await new Promise((resolve) => setTimeout(resolve, 500))

    // Sample data for demo purposes
    const sampleTrackingData: Record<string, any> = {
      "don-1": {
        type: "donation",
        title: "Winter Clothing Collection",
        donorName: "John Doe",
        category: "Clothing",
        quantity: 25,
        condition: "good",
        status: "approved",
        createdAt: "2025-01-10",
        beneficiaryName: null,
      },
      "don-2": {
        type: "donation",
        title: "Children's Books Set",
        donorName: "Jane Smith",
        category: "Books & Education",
        quantity: 50,
        condition: "like-new",
        status: "delivered",
        createdAt: "2025-01-05",
        beneficiaryName: "Hope Foundation",
      },
      "req-1": {
        type: "request",
        title: "Winter Supplies for Shelter",
        beneficiaryName: "Sarah Manager",
        organization: "Hope Foundation",
        category: "Clothing",
        quantity: 100,
        status: "matched",
        urgency: "high",
        createdAt: "2025-01-09",
      },
    }

    const data = sampleTrackingData[trackingId]
    setLoading(false)

    if (data) {
      setResult({ ...data, id: trackingId })
    } else {
      setError("No donation or request found with this ID. Please check and try again.")
    }
  }

  const getStatusIndex = (status: string, type: "donation" | "request") => {
    const steps = type === "donation" ? donationStatusSteps : requestStatusSteps
    return steps.findIndex((s) => s.status === status)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="font-bold text-xl">GiveHope</span>
          </Link>
          <nav className="flex items-center gap-4">
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

      <main className="container mx-auto px-6 py-12 max-w-2xl">
        <div className="text-center mb-10">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Search className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Track Your Donation</h1>
          <p className="text-muted-foreground">Enter your donation or request ID to see its current status.</p>
        </div>

        <Card className="mb-8 border-border/50">
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="trackingId" className="sr-only">
                  Tracking ID
                </Label>
                <Input
                  id="trackingId"
                  placeholder="Enter donation or request ID (e.g., don-1)"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  required
                  className="h-12"
                />
              </div>
              <Button type="submit" className="h-12 px-6" disabled={loading}>
                <Search className="h-4 w-4 mr-2" />
                Track
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <p className="text-destructive text-center">{error}</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                {result.type === "donation" ? (
                  <>
                    <User className="h-4 w-4" />
                    Donation
                  </>
                ) : (
                  <>
                    <Building2 className="h-4 w-4" />
                    Request
                  </>
                )}
              </div>
              <CardTitle>{result.title}</CardTitle>
              <CardDescription>
                {result.type === "donation"
                  ? `Donated by ${result.donorName}`
                  : `Requested by ${result.organization || result.beneficiaryName}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Details */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-5 bg-muted/50 rounded-xl">
                <div>
                  <div className="text-sm text-muted-foreground">Category</div>
                  <div className="font-semibold">{result.category}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Quantity</div>
                  <div className="font-semibold">{result.quantity} items</div>
                </div>
                {result.type === "donation" && (
                  <div>
                    <div className="text-sm text-muted-foreground">Condition</div>
                    <div className="font-semibold capitalize">{result.condition}</div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-muted-foreground">Submitted</div>
                  <div className="font-semibold">{result.createdAt}</div>
                </div>
              </div>

              {/* Status Timeline */}
              <div className="relative">
                <h3 className="font-semibold text-foreground mb-6">Status Timeline</h3>
                <div className="space-y-6">
                  {(result.type === "donation" ? donationStatusSteps : requestStatusSteps).map((step, index) => {
                    const currentIndex = getStatusIndex(result.status, result.type)
                    const isCompleted = index <= currentIndex
                    const isCurrent = index === currentIndex
                    const StepIcon = step.icon

                    return (
                      <div key={step.status} className="flex gap-4">
                        <div className="relative flex flex-col items-center">
                          <div
                            className={`h-11 w-11 rounded-full flex items-center justify-center transition-all ${
                              isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                            } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}
                          >
                            <StepIcon className="h-5 w-5" />
                          </div>
                          {index <
                            (result.type === "donation" ? donationStatusSteps : requestStatusSteps).length - 1 && (
                            <div
                              className={`w-0.5 h-full absolute top-11 ${index < currentIndex ? "bg-primary" : "bg-muted"}`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className={`font-semibold ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                            {step.label}
                            {isCurrent && (
                              <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">{step.description}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Matched Info */}
              {result.type === "donation" && result.beneficiaryName && (
                <div className="mt-6 p-5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Matched with Beneficiary
                  </div>
                  <div className="text-emerald-700">{result.beneficiaryName}</div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Sample IDs for testing */}
        {!searched && (
          <Card className="bg-muted/30 border-border/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground text-center mb-4">
                Don't have a tracking ID? Try these sample IDs:
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {["don-1", "don-2", "req-1"].map((id) => (
                  <Button
                    key={id}
                    variant="outline"
                    size="sm"
                    className="bg-transparent"
                    onClick={() => setTrackingId(id)}
                  >
                    {id}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
