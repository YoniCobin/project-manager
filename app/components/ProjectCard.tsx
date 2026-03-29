import Link from 'next/link'
import { Project, Client, ProjectStatus } from '@/lib/supabase'
import { deadlineDisplay } from '@/lib/utils'
import { EditProjectModal } from '@/app/components/EditProjectModal'

const STATUS_LABELS: Record<ProjectStatus, string> = {
  active: 'פעיל',
  completed: 'הושלם',
  paused: 'מושהה',
}

const STATUS_BADGE: Record<ProjectStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  completed: 'bg-blue-50 text-blue-700',
  paused: 'bg-slate-100 text-slate-500',
}

const STATUS_BAR: Record<ProjectStatus, string> = {
  active: 'bg-emerald-400',
  completed: 'bg-blue-400',
  paused: 'bg-slate-300',
}

interface Props {
  project: Project
  clients: Client[]
}

export function ProjectCard({ project, clients }: Props) {
  const dl = deadlineDisplay(project.deadline)

  return (
    <article className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition-all group">
      <div className={`h-1 ${STATUS_BAR[project.status]}`} />

      <Link href={`/projects/${project.id}`} className="block p-5 pb-3">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold text-slate-900 text-sm leading-snug group-hover:text-indigo-600 transition-colors">
            {project.name}
          </h3>
          <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_BADGE[project.status]}`}>
            {STATUS_LABELS[project.status]}
          </span>
        </div>

        <div className="flex flex-col gap-1.5 min-h-[2rem]">
          {project.client && (
            <p className="text-xs text-slate-500">
              <span className="text-slate-400">לקוח · </span>
              <span className="text-slate-600 font-medium">{project.client.name}</span>
            </p>
          )}
          {dl && (
            <p className={`text-xs ${dl.className}`}>{dl.text}</p>
          )}
          {!project.client && !dl && (
            <p className="text-xs text-slate-300">ללא לקוח · ללא deadline</p>
          )}
        </div>
      </Link>

      <div className="px-5 pb-4 pt-2 border-t border-slate-50 flex items-center">
        <EditProjectModal project={project} clients={clients} />
      </div>
    </article>
  )
}
