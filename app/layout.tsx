import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "FlightChat - Twój AI Asystent Podróży",
  description: "Znajdź najlepsze loty rozmawiając naturalnie z AI. Loty, atrakcje, pogoda i transport w jednym miejscu.",
  keywords: "loty, podróże, AI, asystent podróży, tanie loty, wakacje",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="pl">
        <body
          className={`${inter.className} antialiased`}
        >
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
