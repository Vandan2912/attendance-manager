"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Camera,
  ChevronRight,
  Clock,
  FileText,
  LineChart,
  Shield,
  Users,
  Scan,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
  const route = useRouter();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center hero-gradient overflow-hidden">
        {/* Animated Background Grid */}
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />

        {/* Floating Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-[20%] animate-float">
            <div className="glass-card rounded-xl p-4 flex items-center gap-3">
              <Scan className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">Face Detection</span>
            </div>
          </div>
          <div className="absolute top-40 right-[25%] animate-float-delay-2">
            <div className="glass-card rounded-xl p-4 flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <span className="text-sm font-medium">Attendance Marked</span>
            </div>
          </div>
          <div className="absolute bottom-32 left-[20%] animate-float-delay-4">
            <div className="glass-card rounded-xl p-4 flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-blue-400" />
              <span className="text-sm font-medium">98% Accuracy</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 text-center relative z-10">
          {/* <div className="flex items-center justify-center mb-6">
            <Camera className="h-12 w-12 text-primary mr-4" />
            <h2 className="text-xl font-semibold">AttendAI</h2>
          </div> */}

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
              Revolutionizing
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary/70 to-primary">
              Attendance with AI
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-black max-w-3xl mx-auto mb-8">
            Transform your institution's attendance management with our cutting-edge face recognition system. Fast,
            secure, and automated tracking for the modern education era.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="text-lg w-full sm:w-auto bg-primary hover:bg-primary/90"
              onClick={() => route.push("/login")}
            >
              Get Started
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg w-full sm:w-auto glass-card">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z"
              fill="hsl(var(--background))"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Powerful Features for Modern Education</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Camera className="h-8 w-8" />}
              title="Real-time Face Detection"
              description="Advanced AI-powered face recognition for instant and accurate attendance marking"
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8" />}
              title="Automated Attendance"
              description="Save time with automated attendance tracking and reporting"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Dual Dashboard"
              description="Separate interfaces for teachers and students with role-specific features"
            />
            <FeatureCard
              icon={<LineChart className="h-8 w-8" />}
              title="Analytics & Reports"
              description="Comprehensive attendance analytics and downloadable reports"
            />
            <FeatureCard
              icon={<Calendar className="h-8 w-8" />}
              title="Calendar Integration"
              description="View and manage attendance with an intuitive calendar interface"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Secure & Private"
              description="Enterprise-grade security for your biometric and attendance data"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <Step
                number="01"
                title="Create Your Account"
                description="Sign up as a teacher or student and complete your profile"
              />
              <Step
                number="02"
                title="Face Registration"
                description="Register your face securely for attendance tracking"
              />
              <Step
                number="03"
                title="Join Classes"
                description="Teachers create classes and students join with unique codes"
              />
              <Step
                number="04"
                title="Mark Attendance"
                description="Simply show your face to the camera to mark attendance"
              />
            </div>
            <div className="relative aspect-square rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&q=80"
                alt="Face Recognition Demo"
                className="object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Role-based Features */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">Features for Everyone</h2>
          <Tabs defaultValue="teachers" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="teachers">For Teachers</TabsTrigger>
              <TabsTrigger value="students">For Students</TabsTrigger>
            </TabsList>
            <TabsContent value="teachers" className="space-y-4">
              <FeatureList
                items={[
                  "Create and manage multiple classes",
                  "Real-time attendance tracking",
                  "Detailed analytics and reports",
                  "Share announcements and materials",
                  "Export attendance data",
                  "Monitor attendance trends",
                ]}
              />
            </TabsContent>
            <TabsContent value="students" className="space-y-4">
              <FeatureList
                items={[
                  "Quick face-based attendance",
                  "View attendance history",
                  "Track attendance percentage",
                  "Access class materials",
                  "Receive notifications",
                  "Download attendance reports",
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-xl mb-4">AttendAI</h3>
              <p className="text-muted-foreground">
                Revolutionizing attendance management with cutting-edge face recognition technology.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li>Features</li>
                <li>Pricing</li>
                <li>Documentation</li>
                <li>API</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li>About</li>
                <li>Blog</li>
                <li>Careers</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Security</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
            © 2024 AttendAI. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </Card>
  );
}

interface StepProps {
  number: string;
  title: string;
  description: string;
}

function Step({ number, title, description }: StepProps) {
  return (
    <div className="flex gap-4">
      <div className="text-4xl font-bold text-primary/30">{number}</div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

function FeatureList({ items }: { items: string[] }) {
  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item, index) => (
        <li key={index} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <FileText className="h-4 w-4" />
          </div>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
