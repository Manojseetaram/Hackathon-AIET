import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-primary/10 rounded-full border border-gray-200">
              <svg className="h-12 w-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 text-balance mb-4">Smart Attendance Management System</h1>
          <p className="text-xl text-gray-600 text-balance max-w-2xl mx-auto mb-8">
            AI-powered attendance tracking with face recognition technology for modern educational institutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="text-lg px-8 bg-primary hover:bg-primary/90 text-white border border-primary"
            >
              <Link href="/login">Student Login</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Link href="/signup">Create Account</Link>
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <Card className="text-center bg-white border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="mx-auto p-3 bg-primary/10 rounded-full w-fit mb-4 border border-gray-200">
                <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <CardTitle className="text-gray-900">AI Face Recognition</CardTitle>
              <CardDescription className="text-gray-600">
                Secure and accurate attendance tracking using advanced facial recognition technology
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center bg-white border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="mx-auto p-3 bg-secondary/10 rounded-full w-fit mb-4 border border-gray-200">
                <svg className="h-8 w-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <CardTitle className="text-gray-900">Real-time Analytics</CardTitle>
              <CardDescription className="text-gray-600">
                Track attendance patterns and generate comprehensive reports for better insights
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center bg-white border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="mx-auto p-3 bg-accent/10 rounded-full w-fit mb-4 border border-gray-200">
                <svg className="h-8 w-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </div>
              <CardTitle className="text-gray-900">Student Portal</CardTitle>
              <CardDescription className="text-gray-600">
                Complete dashboard for students to manage attendance, requests, and payments
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  )
}
