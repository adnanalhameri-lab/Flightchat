// Destination Tabs Component - Radix UI tabs for destination card content

'use client'

import * as Tabs from '@radix-ui/react-tabs'
import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Tab {
  value: string
  label: string
  icon?: ReactNode
  content: ReactNode
}

interface DestinationTabsProps {
  tabs: Tab[]
  defaultTab?: string
}

export function DestinationTabs({ tabs, defaultTab }: DestinationTabsProps) {
  return (
    <Tabs.Root defaultValue={defaultTab || tabs[0]?.value} className="w-full">
      {/* Tab List */}
      <Tabs.List className="flex gap-1 border-b border-white/20 mb-4">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className="
              relative px-4 py-2.5 text-sm font-medium transition-all
              text-white/70 hover:text-white
              data-[state=active]:text-white
              outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-t-lg
            "
          >
            <span className="flex items-center gap-2">
              {tab.icon}
              {tab.label}
            </span>
            
            {/* Active indicator */}
            <Tabs.Content value={tab.value} forceMount>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-orange-400"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                exit={{ scaleX: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Tabs.Content>
          </Tabs.Trigger>
        ))}
      </Tabs.List>

      {/* Tab Panels */}
      {tabs.map((tab) => (
        <Tabs.Content
          key={tab.value}
          value={tab.value}
          className="outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-lg"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {tab.content}
          </motion.div>
        </Tabs.Content>
      ))}
    </Tabs.Root>
  )
}
