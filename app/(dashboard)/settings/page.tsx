// Settings Page

'use client'

import { useUser } from '@clerk/nextjs'
import { Settings as SettingsIcon, User, CreditCard, Bell, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const { user } = useUser()

  return (
    <div className="h-screen overflow-y-auto bg-transparent">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/chat"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 font-medium transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Powrót do czatu
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-ocean bg-clip-text text-transparent mb-2">Ustawienia</h1>
          <p className="text-gray-600">
            Zarządzaj swoim kontem i preferencjami
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Account */}
          <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-text">Konto</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="text-gray-900 font-medium">
                  {user?.emailAddresses[0]?.emailAddress}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Imię</p>
                <p className="text-gray-900 font-medium">
                  {user?.firstName || 'Nie ustawiono'}
                </p>
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-white/80 backdrop-blur-sm border border-blue-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-text">Subskrypcja</h2>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
              <div>
                <p className="font-semibold text-green-700">Pro Plan - Aktywny</p>
                <p className="text-sm text-gray-600">
                  $10/tydzień • Nieograniczone wyszukiwania
                </p>
              </div>
              <button className="px-4 py-2 bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium text-blue-600">
                Zarządzaj
              </button>
            </div>
          </div>

          {/* Preferences - Coming Soon */}
          <div className="bg-white/60 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 shadow-lg opacity-70">
            <div className="flex items-center gap-3 mb-4">
              <SettingsIcon className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-text">Preferencje</h2>
            </div>
            <p className="text-sm text-gray-600">
              Wkrótce: Domyślne lotnisko, waluta, język i więcej...
            </p>
          </div>

          {/* Notifications - Coming Soon */}
          <div className="bg-white/60 backdrop-blur-sm border border-blue-100 rounded-2xl p-6 shadow-lg opacity-70">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-text">Powiadomienia</h2>
            </div>
            <p className="text-sm text-gray-600">
              Wkrótce: Powiadomienia o spadkach cen i więcej...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
