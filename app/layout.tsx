import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from "./ThemeProvider"


export const metadata: Metadata = {
  title: 'Wessenger',
  description: 'WeChat, but Messenger',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  
  return (
    <html lang="en">
      <body >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange={true}
          >
            {children}
          </ThemeProvider>
      </body>
    </html>
  )
}
