export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { getClients, getProjects } from '@/lib/supabase'
import { NewClientForm } from '@/app/components/NewClientForm'
import { EditClientModal } from '@/app/components/EditClientModal'

function initials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

const AVATAR_COLORS = [
  'bg-indigo-100 text-indigo-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-rose-100 text-rose-700',
  'bg-violet-100 text-violet-700',
  'bg-cyan-100 text-cyan-700',
]

export default async function ClientsPage() {
  const [clients, projects] = await Promise.all([getClients(), getProjects()])

  const projectsByClient = projects.reduce<Record<string, number>>((acc, p) => {
    if (p.client_id) acc[p.client_id] = (acc[p.client_id] ?? 0) + 1
    return acc
  }, {})

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">לקוחות</h1>
          <p className="text-sm text-slate-500 mt-0.5">{clients.length} לקוחות</p>
        </div>
        <NewClientForm />
      </div>

      {clients.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-20 text-center shadow-sm">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
          </div>
          <p className="text-slate-600 font-medium">אין לקוחות עדיין</p>
          <p className="text-sm text-slate-400 mt-1">לחץ על "לקוח חדש" להוסיף</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-right">
                <th className="px-5 py-3.5 font-medium text-slate-500 text-xs">לקוח</th>
                <th className="px-5 py-3.5 font-medium text-slate-500 text-xs">מייל</th>
                <th className="px-5 py-3.5 font-medium text-slate-500 text-xs">טלפון</th>
                <th className="px-5 py-3.5 font-medium text-slate-500 text-xs text-center">פרויקטים</th>
                <th className="px-5 py-3.5 font-medium text-slate-500 text-xs text-center">פעולות</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((client, i) => {
                const count = projectsByClient[client.id] ?? 0
                return (
                  <tr key={client.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Name with avatar */}
                    <td className="px-5 py-4">
                      <Link href={`/clients/${client.id}`} className="flex items-center gap-3 group">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                          {initials(client.name)}
                        </span>
                        <span className="font-medium text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {client.name}
                        </span>
                      </Link>
                    </td>

                    {/* Email */}
                    <td className="px-5 py-4 text-slate-500">
                      {client.email ? (
                        <a href={`mailto:${client.email}`} className="hover:text-indigo-600 transition-colors">
                          {client.email}
                        </a>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>

                    {/* Phone */}
                    <td className="px-5 py-4 text-slate-500">
                      {client.phone ?? <span className="text-slate-300">—</span>}
                    </td>

                    {/* Projects count + link */}
                    <td className="px-5 py-4 text-center">
                      <Link
                        href={`/clients/${client.id}`}
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                          count > 0
                            ? 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                            : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {count > 0 && (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                        )}
                        {count} פרויקטים
                      </Link>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-center">
                      <EditClientModal client={client} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
