export const dynamic = 'force-dynamic'

import { getProjects, getClients, ProjectStatus } from '@/lib/supabase'
import { NewProjectForm } from '@/app/components/NewProjectForm'
import { ProjectCard } from '@/app/components/ProjectCard'

const STAT_COLORS: Record<string, string> = {
  total: 'text-slate-900',
  active: 'text-emerald-600',
  completed: 'text-blue-600',
  paused: 'text-slate-400',
}

export default async function ProjectsPage() {
  const [projects, clients] = await Promise.all([getProjects(), getClients()])

  const active = projects.filter((p) => p.status === 'active').length
  const completed = projects.filter((p) => p.status === 'completed').length
  const paused = projects.filter((p) => p.status === 'paused').length

  const stats = [
    { key: 'total', label: 'סה"כ', value: projects.length },
    { key: 'active', label: 'פעילים', value: active },
    { key: 'completed', label: 'הושלמו', value: completed },
    { key: 'paused', label: 'מושהים', value: paused },
  ]

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">פרויקטים</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {projects.length} פרויקטים · {clients.length} לקוחות
          </p>
        </div>
        <NewProjectForm clients={clients} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {stats.map(({ key, label, value }) => (
          <div key={key} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className={`text-3xl font-bold ${STAT_COLORS[key]}`}>{value}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Projects grid */}
      {projects.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl py-20 text-center shadow-sm">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6z" />
            </svg>
          </div>
          <p className="text-slate-600 font-medium">אין פרויקטים עדיין</p>
          <p className="text-sm text-slate-400 mt-1">לחץ על "פרויקט חדש" כדי להתחיל</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} clients={clients} />
          ))}
        </div>
      )}
    </div>
  )
}
