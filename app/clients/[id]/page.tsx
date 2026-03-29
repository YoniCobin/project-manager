import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getClient, getProjectsByClient, getClients } from '@/lib/supabase'
import { ProjectCard } from '@/app/components/ProjectCard'
import { EditClientModal } from '@/app/components/EditClientModal'

function initials(name: string): string {
  return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
}

export default async function ClientPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [client, projects, allClients] = await Promise.all([
    getClient(id).catch(() => null),
    getProjectsByClient(id),
    getClients(),
  ])

  if (!client) notFound()

  const active = projects.filter((p) => p.status === 'active').length
  const completed = projects.filter((p) => p.status === 'completed').length

  return (
    <div>
      {/* Back */}
      <Link
        href="/clients"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-7 transition-colors group"
      >
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
        </svg>
        חזרה ללקוחות
      </Link>

      {/* Client header card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-lg font-bold">
              {initials(client.name)}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">{client.name}</h1>
              <div className="flex flex-wrap gap-4 mt-1.5">
                {client.email && (
                  <a href={`mailto:${client.email}`} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    {client.email}
                  </a>
                )}
                {client.phone && (
                  <span className="flex items-center gap-1.5 text-sm text-slate-500">
                    <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    {client.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
          <EditClientModal client={client} />
        </div>

        {/* Stats */}
        {projects.length > 0 && (
          <div className="flex gap-4 mt-5 pt-5 border-t border-slate-100">
            <div className="text-center px-4">
              <p className="text-2xl font-bold text-slate-800">{projects.length}</p>
              <p className="text-xs text-slate-500 mt-0.5">סה"כ פרויקטים</p>
            </div>
            <div className="text-center px-4 border-r border-slate-100">
              <p className="text-2xl font-bold text-emerald-600">{active}</p>
              <p className="text-xs text-slate-500 mt-0.5">פעילים</p>
            </div>
            <div className="text-center px-4 border-r border-slate-100">
              <p className="text-2xl font-bold text-blue-600">{completed}</p>
              <p className="text-xs text-slate-500 mt-0.5">הושלמו</p>
            </div>
          </div>
        )}
      </div>

      {/* Projects */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-800">פרויקטים</h2>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-14 text-center shadow-sm">
          <p className="text-slate-500 font-medium">אין פרויקטים מקושרים ללקוח זה</p>
          <Link href="/" className="inline-block mt-3 text-sm text-indigo-600 hover:text-indigo-700 transition-colors">
            הוסף פרויקט
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} clients={allClients} />
          ))}
        </div>
      )}
    </div>
  )
}
