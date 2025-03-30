import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Uni Global - Study Abroad Assistant",
  description: "Your AI-powered guide to studying abroad. Get personalized assistance with university selection, documentation, and application process.",
  keywords: ["study abroad", "university application", "AI assistant", "education", "international studies"],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="font-inter min-h-screen">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  )
}