'use server'

import { revalidatePath } from 'next/cache'
import { supabase, ProjectStatus } from '@/lib/supabase'

export async function addProjectAction(formData: FormData) {
  const name = formData.get('name') as string
  const client_id = (formData.get('client_id') as string) || null
  const deadline = (formData.get('deadline') as string) || null

  const { error } = await supabase.from('projects').insert({
    name,
    client_id,
    status: 'active' as ProjectStatus,
    deadline,
  })
  if (error) throw error
  revalidatePath('/')
}

export async function addTaskAction(formData: FormData) {
  const project_id = formData.get('project_id') as string
  const title = formData.get('title') as string

  const { error } = await supabase.from('tasks').insert({ project_id, title, done: false })
  if (error) throw error
  revalidatePath(`/projects/${project_id}`)
}

export async function addClientAction(formData: FormData) {
  const name = formData.get('name') as string
  const email = (formData.get('email') as string) || null
  const phone = (formData.get('phone') as string) || null

  const { error } = await supabase.from('clients').insert({ name, email, phone })
  if (error) throw error
  revalidatePath('/clients')
}

export async function toggleTaskAction(id: string, projectId: string, done: boolean) {
  const { error } = await supabase.from('tasks').update({ done }).eq('id', id)
  if (error) throw error
  revalidatePath(`/projects/${projectId}`)
}

export async function updateProjectStatusAction(id: string, status: ProjectStatus) {
  const { error } = await supabase.from('projects').update({ status }).eq('id', id)
  if (error) throw error
  revalidatePath(`/projects/${id}`)
  revalidatePath('/')
}

export async function updateProjectAction(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const client_id = (formData.get('client_id') as string) || null
  const status = formData.get('status') as ProjectStatus
  const deadline = (formData.get('deadline') as string) || null

  const { error } = await supabase
    .from('projects')
    .update({ name, client_id, status, deadline })
    .eq('id', id)
  if (error) throw error
  revalidatePath('/')
  revalidatePath(`/projects/${id}`)
}

export async function updateClientAction(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const email = (formData.get('email') as string) || null
  const phone = (formData.get('phone') as string) || null

  const { error } = await supabase.from('clients').update({ name, email, phone }).eq('id', id)
  if (error) throw error
  revalidatePath('/clients')
  revalidatePath(`/clients/${id}`)
}
