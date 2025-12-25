import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle2, Package, Users, TrendingUp, Shield, Globe, Zap, Heart, Sparkles } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <Heart className="h-5 w-5 text-primary-foreground fill-primary-foreground" />
            </div>
            <span className="font-bold text-xl tracking-tight">GiveHope</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </Link>
            <Link href="#impact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Impact
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="gap-2">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 md:py-32 overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 border border-primary/20 bg-primary/5 px-4 py-1.5 rounded-full text-sm mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-foreground/80">Trusted by 850+ organizations worldwide</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 text-balance">
              Transform Lives Through
              <span className="text-primary block mt-2">Purposeful Giving</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty leading-relaxed">
              GiveHope connects generous donors with verified beneficiaries, ensuring every donation creates meaningful,
              trackable impact in communities that need it most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base gap-2">
                  Start Donating
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/request">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-8 text-base bg-transparent">
                  Request Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-border bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { value: "12,450+", label: "Items Donated", sublabel: "and counting" },
              { value: "3,200+", label: "Active Donors", sublabel: "trusted community" },
              { value: "850+", label: "NGOs Served", sublabel: "verified partners" },
              { value: "98%", label: "Success Rate", sublabel: "delivery confirmed" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm font-medium text-foreground mt-1">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.sublabel}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Built for Trust & Transparency</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Every feature designed to ensure your donations reach those who need them most.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Verified Recipients",
                description:
                  "All beneficiaries and NGOs go through a rigorous verification process before joining our platform.",
              },
              {
                icon: TrendingUp,
                title: "Real-time Tracking",
                description:
                  "Monitor your donation from submission to delivery with complete visibility at every step.",
              },
              {
                icon: Globe,
                title: "Global Reach",
                description:
                  "Connect with organizations across the world, making a difference wherever help is needed.",
              },
              {
                icon: Zap,
                title: "Smart Matching",
                description: "Our algorithm matches donations with the most relevant requests for maximum impact.",
              },
              {
                icon: Package,
                title: "Any Item Welcome",
                description:
                  "From clothing to electronics, medical supplies to books — every item can make a difference.",
              },
              {
                icon: Users,
                title: "Community Driven",
                description: "Join thousands of donors and organizations working together to create positive change.",
              },
            ].map((feature) => (
              <Card
                key={feature.title}
                className="border-border/50 bg-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 md:py-32 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Three simple steps to make a meaningful difference.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "01",
                title: "Create Account",
                description: "Sign up in under 2 minutes. Tell us if you want to donate or receive support.",
              },
              {
                step: "02",
                title: "List or Request",
                description: "Donors list items with details. Beneficiaries specify their needs and urgency.",
              },
              {
                step: "03",
                title: "Track Impact",
                description: "We handle matching and logistics. You track the journey and see your impact.",
              },
            ].map((item, index) => (
              <div key={item.step} className="relative">
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/30 to-transparent" />
                )}
                <div className="relative bg-background rounded-2xl p-8 border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donor & Beneficiary Features */}
      <section id="impact" className="py-24 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* For Donors */}
            <div className="bg-primary text-primary-foreground rounded-2xl p-8 md:p-10">
              <p className="text-sm font-medium text-primary-foreground/70 uppercase tracking-wider mb-2">For Donors</p>
              <h3 className="text-2xl md:text-3xl font-bold mb-6">Make Every Donation Count</h3>
              <ul className="space-y-4">
                {[
                  "Easy item listing with photos and details",
                  "Real-time tracking from pickup to delivery",
                  "Impact reports showing who benefited",
                  "Tax receipt generation for eligible items",
                  "Direct connection with verified NGOs",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
                    <span className="text-primary-foreground/90">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/login" className="inline-block mt-8">
                <Button variant="secondary" size="lg" className="gap-2">
                  Start Donating
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* For Beneficiaries */}
            <div className="bg-card border border-border rounded-2xl p-8 md:p-10">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2">
                For Beneficiaries
              </p>
              <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-6">Get the Support You Need</h3>
              <ul className="space-y-4">
                {[
                  "Submit detailed requests for specific items",
                  "Priority matching with available donations",
                  "Secure verification for organizations",
                  "Coordination support for logistics",
                  "Regular updates on request status",
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/request" className="inline-block mt-8">
                <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                  Request Support
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-muted/30">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Ready to Make a Difference?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-lg">
            Join thousands creating positive change. It takes less than 2 minutes to get started.
          </p>
          <Link href="/login">
            <Button size="lg" className="h-12 px-8 text-base gap-2">
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <Heart className="h-4 w-4 text-primary-foreground fill-primary-foreground" />
              </div>
              <span className="font-semibold">GiveHope</span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">
                About
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">2025 GiveHope. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
