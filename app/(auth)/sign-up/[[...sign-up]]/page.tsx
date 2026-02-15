// Sign Up Page

import { SignUp } from '@clerk/nextjs'
import { Plane } from 'lucide-react'

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 px-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
            <Plane className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Dołącz do FlightChat
          </h1>
          <p className="text-gray-600">
            Zacznij planować wymarzone podróże z AI
          </p>
        </div>

        {/* Clerk Sign Up Component */}
        <div className="flex justify-center">
          <SignUp
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-xl border border-gray-200 bg-white',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton: 'bg-white border-gray-200 hover:bg-gray-50',
                formButtonPrimary: 'bg-primary hover:bg-primary-hover',
                footerActionLink: 'text-primary hover:text-primary-hover',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
