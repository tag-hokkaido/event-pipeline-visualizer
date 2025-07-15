import type React from "react"

import type { Metadata } from "next"
import "./globals.css"
import { ThemeProviderWrapper } from "../components/theme-provider-wrapper"

export const metadata: Metadata = {
  title: "Event Pipeline Visualizer Demo",
  description: "A demo application for the Event Pipeline Visualizer library",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProviderWrapper>
          {children}
        </ThemeProviderWrapper>
      </body>
    </html>
  )
}
