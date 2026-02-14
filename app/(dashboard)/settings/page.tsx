// Settings Page

'use client'

import { useUser } from '@clerk/nextjs'
import { Settings as SettingsIcon, User, CreditCard, Bell } from 'lucide-react'

export default function SettingsPage() {
  const { user } = useUser()

  return (
    <div className="h-screen overflow-y-auto bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text mb-2">Ustawienia</h1>
          <p className="text-text-secondary">
            Zarządzaj swoim kontem i preferencjami
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Account */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-text">Konto</h2>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-text-secondary mb-1">Email</p>
                <p className="text-text font-medium">
                  {user?.emailAddresses[0]?.emailAddress}
                </p>
              </div>
              <div>
                <p className="text-sm text-text-secondary mb-1">Imię</p>
                <p className="text-text font-medium">
                  {user?.firstName || 'Nie ustawiono'}
                </p>
              </div>
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-surface border border-border rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-text">Subskrypcja</h2>
            </div>
            <div className="flex items-center justify-between p-4 bg-success/10 border border-success/30 rounded-lg">
              <div>
                <p className="font-semibold text-success">Pro Plan - Aktywny</p>
                <p className="text-sm text-text-secondary">
                  $10/tydzień • Nieograniczone wyszukiwania
                </p>
              </div>
              <button className="px-4 py-2 bg-surface border border-border rounded-lg hover:bg-background transition-colors text-sm font-medium">
                Zarządzaj
              </button>
            </div>
          </div>

          {/* Preferences - Coming Soon */}
          <div className="bg-surface border border-border rounded-lg p-6 opacity-50">
            <div className="flex items-center gap-3 mb-4">
              <SettingsIcon className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-text">Preferencje</h2>
            </div>
            <p className="text-sm text-text-secondary">
              Wkrótce: Domyślne lotnisko, waluta, język i więcej...
            </p>
          </div>

          {/* Notifications - Coming Soon */}
          <div className="bg-surface border border-border rounded-lg p-6 opacity-50">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-text">Powiadomienia</h2>
            </div>
            <p className="text-sm text-text-secondary">
              Wkrótce: Powiadomienia o spadkach cen i więcej...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
