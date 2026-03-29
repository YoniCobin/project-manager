import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { NavLinks } from '@/app/components/NavLinks'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

export const metadata: Metadata = {
  title: 'ניהול פרויקטים',
  description: 'לוח ניהול פרויקטים ומשימות',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={geist.variable}>
      <body className="min-h-screen bg-slate-50 font-sans">
        {/* Sidebar — right side (RTL start) */}
        <aside className="fixed right-0 top-0 h-screen w-60 bg-slate-900 flex flex-col z-20">
          <div className="px-5 py-6 border-b border-white/10">
            <h1 className="font-bold text-white text-sm tracking-wide">ניהול פרויקטים</h1>
            <p className="text-slate-500 text-xs mt-0.5">לוח בקרה</p>
          </div>

          <div className="flex-1 px-3 py-4 overflow-y-auto">
            <NavLinks />
          </div>

          <div className="px-5 py-4 border-t border-white/5">
            <p className="text-xs text-slate-600">Project Manager v1.0</p>
          </div>
        </aside>

        {/* Main content — offset by sidebar */}
        <div className="mr-60 min-h-screen">
          <main className="max-w-5xl px-8 py-8">{children}</main>
        </div>
      </body>
    </html>
  )
}
