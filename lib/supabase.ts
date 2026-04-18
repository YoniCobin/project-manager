import { createClient as createSupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)

// Types

export type ClientStatus = 'active' | 'inactive'
export type ProjectStatus = 'active' | 'completed' | 'paused'

export interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  created_at: string
}

export interface Project {
  id: string
  name: string
  client_id: string | null
  status: ProjectStatus
  deadline: string | null
  created_at: string
  client?: Client
}

export interface Task {
  id: string
  project_id: string
  title: string
  done: boolean
  created_at: string
}

// Clients

export async function getClients(): Promise<Client[]> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .order('name')
  if (error) throw error
  return data
}

export async function createClient(client: Omit<Client, 'id' | 'created_at'>): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .insert(client)
    .select()
    .single()
  if (error) throw error
  return data
}

// Projects

export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, client:clients(*)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getProject(id: string): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, client:clients(*)')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createProject(project: Omit<Project, 'id' | 'created_at' | 'client'>): Promise<Project> {
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateProjectStatus(id: string, status: ProjectStatus): Promise<void> {
  const { error } = await supabase
    .from('projects')
    .update({ status })
    .eq('id', id)
  if (error) throw error
}

// Tasks

export async function getTasks(projectId: string): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', projectId)
    .order('created_at')
  if (error) throw error
  return data
}

export async function createTask(task: Omit<Task, 'id' | 'created_at'>): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function toggleTask(id: string, done: boolean): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .update({ done })
    .eq('id', id)
  if (error) throw error
}

export async function getClient(id: string): Promise<Client> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function getProjectsByClient(clientId: string): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*, client:clients(*)')
    .eq('client_id', clientId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

// Vehicles (luxury car rental)

export type VehicleStatus = 'available' | 'rented' | 'maintenance'
export type VehicleCategory = 'sport' | 'sedan' | 'suv' | 'convertible'

export interface VehicleImage {
  id: string
  vehicle_id: string
  url: string
  alt_he: string | null
  sort_order: number
  created_at: string
}

export interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  category: VehicleCategory
  daily_price_ils: number
  status: VehicleStatus
  description_he: string | null
  engine_size: string | null
  horsepower: number | null
  zero_to_hundred: number | null
  top_speed: number | null
  transmission: string | null
  seats: number | null
  fuel_type: string | null
  cover_image_url: string | null
  created_at: string
  images?: VehicleImage[]
}

export interface VehicleFilters {
  category?: VehicleCategory
  available?: boolean
  priceMin?: number
  priceMax?: number
}

export async function getVehicles(filters?: VehicleFilters): Promise<Vehicle[]> {
  let query = supabase.from('vehicles').select('*')

  if (filters?.category) query = query.eq('category', filters.category)
  if (filters?.available) query = query.eq('status', 'available')
  if (filters?.priceMin !== undefined) query = query.gte('daily_price_ils', filters.priceMin)
  if (filters?.priceMax !== undefined) query = query.lte('daily_price_ils', filters.priceMax)

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getVehicle(id: string): Promise<Vehicle> {
  const { data, error } = await supabase
    .from('vehicles')
    .select('*, images:vehicle_images(*)')
    .eq('id', id)
    .single()
  if (error) throw error
  if (data?.images) {
    data.images.sort((a: VehicleImage, b: VehicleImage) => a.sort_order - b.sort_order)
  }
  return data
}
