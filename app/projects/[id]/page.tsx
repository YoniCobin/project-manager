import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject, getTasks, getClients, ProjectStatus } from '@/lib/supabase'
import { deadlineDisplay } from '@/lib/utils'
import { TaskCheckbox } from '@/app/components/TaskCheckbox'
import { StatusSelect } from '@/app/components/StatusSelect'
import { NewTaskForm } from '@/app/components/NewTaskForm'
import { EditProjectModal } from '@/app/components/EditProjectModal'

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [project, tasks, clients] = await Promise.all([
    getProject(id).catch(() => null),
    getTasks(id),
    getClients(),
  ])

  if (!project) notFound()

  const doneTasks = tasks.filter((t) => t.done).length
  const totalTasks = tasks.length
  const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0
  const dl = deadlineDisplay(project.deadline)

  return (
    <div>
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-7 transition-colors group"
      >
        <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
        </svg>
        חזרה לפרויקטים
      </Link>

      {/* Project header card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-5 overflow-hidden">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-xl font-bold text-slate-900 leading-tight">{project.name}</h1>
            <div className="flex items-center gap-2 shrink-0">
              <StatusSelect projectId={project.id} currentStatus={project.status as ProjectStatus} />
              <EditProjectModal project={project} clients={clients} />
            </div>
          </div>

          <div className="flex flex-wrap gap-5 text-sm">
            {project.client && (
              <div className="flex items-center gap-2 text-slate-500">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <Link href={`/clients/${project.client_id}`} className="text-slate-700 font-medium hover:text-indigo-600 transition-colors">
                  {project.client.name}
                </Link>
                {project.client.email && (
                  <span className="text-slate-400">· {project.client.email}</span>
                )}
              </div>
            )}
            {dl && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
                </svg>
                <span className={`font-medium ${dl.className}`}>{dl.text}</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress bar */}
        {totalTasks > 0 && (
          <div className="px-6 pb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500">התקדמות</span>
              <span className="text-xs font-semibold text-slate-600">{doneTasks}/{totalTasks} משימות</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Tasks card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-1">משימות</h2>
        <p className="text-xs text-slate-400 mb-5">
          {totalTasks === 0 ? 'אין משימות עדיין' : `${doneTasks} מתוך ${totalTasks} הושלמו`}
        </p>

        {tasks.length > 0 && (
          <div className="divide-y divide-slate-100">
            {tasks.map((task) => (
              <TaskCheckbox
                key={task.id}
                id={task.id}
                projectId={project.id}
                title={task.title}
                done={task.done}
              />
            ))}
          </div>
        )}

        <NewTaskForm projectId={project.id} />
      </div>
    </div>
  )
}
