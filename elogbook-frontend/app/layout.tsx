import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import {ClerkProvider} from "@clerk/nextjs";
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "E-Logbook System",
  description: "A web-based platform for managing student industrial training logs",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClerkProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}

