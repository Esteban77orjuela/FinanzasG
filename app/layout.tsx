import type { Metadata, Viewport } from 'next'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'
import DevErrorFilter from '@/components/DevErrorFilter'
import ThemeInit from '@/components/ThemeInit'
import './globals.css'

export const metadata: Metadata = {
  title: 'FinanzasG — Finanzas Personales',
  description: 'Controla tus gastos e ingresos personales. Registra gastos fijos y esporádicos, ve tu balance mes a mes.',
  keywords: ['finanzas personales', 'presupuesto', 'gastos', 'ingresos', 'balance'],
  authors: [{ name: 'FinanzasG' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FinanzasG',
  },
}

export const viewport: Viewport = {
  themeColor: '#10b981',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <ThemeInit />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ServiceWorkerRegister />
        <DevErrorFilter />
      </body>
    </html>
  )
}
