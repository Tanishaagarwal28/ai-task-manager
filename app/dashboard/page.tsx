'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

type Task = {
  id: string
  title: string
  description: string | null
  status: string
  user_id: string
  created_at: string
}

export default function DashboardPage() {
  const router = useRouter()

  const [userId, setUserId] = useState<string | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)

  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    setUserId(user.id)
    await fetchTasks(user.id)
    setLoading(false)
  }

  const fetchTasks = async (uid: string) => {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })

    if (error) {
      setTasks([])
      return
    }

    setTasks(data || [])
  }

  const addTask = async () => {
    if (!title.trim() || !userId) return

    const { error } = await supabase.from('tasks').insert([
      {
        user_id: userId,
        title: title.trim(),
        description: description.trim(),
        status: 'pending',
      },
    ])

    if (error) {
      alert(error.message)
      return
    }

    setTitle('')
    setDescription('')
    await fetchTasks(userId)
  }

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    if (userId) {
      await fetchTasks(userId)
    }
  }

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed'

    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', task.id)

    if (error) {
      alert(error.message)
      return
    }

    if (userId) {
      await fetchTasks(userId)
    }
  }

  const startEdit = (task: Task) => {
    setEditingTaskId(task.id)
    setEditTitle(task.title)
    setEditDescription(task.description || '')
  }

  const cancelEdit = () => {
    setEditingTaskId(null)
    setEditTitle('')
    setEditDescription('')
  }

  const saveEdit = async (id: string) => {
    if (!editTitle.trim()) return

    const { error } = await supabase
      .from('tasks')
      .update({
        title: editTitle.trim(),
        description: editDescription.trim(),
      })
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    cancelEdit()

    if (userId) {
      await fetchTasks(userId)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
          Loading dashboard...
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-1 text-slate-600">Manage your tasks here</p>
          </div>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-red-500 px-4 py-2 text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="mb-8 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 text-2xl font-semibold">Add New Task</h2>

          <div className="grid gap-4">
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
            />

            <textarea
              placeholder="Task description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
              rows={5}
            />

            <button
              onClick={addTask}
              className="w-full rounded-xl bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 md:w-fit"
            >
              Add Task
            </button>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h2 className="mb-4 text-2xl font-semibold">Your Tasks</h2>

          {tasks.length === 0 ? (
            <p className="text-slate-500">No tasks yet. Add your first task.</p>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="rounded-2xl border border-slate-200 p-4"
                >
                  {editingTaskId === task.id ? (
                    <div className="space-y-3">
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 p-3"
                      />
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={4}
                        className="w-full rounded-xl border border-slate-300 p-3"
                      />
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <button
                          onClick={() => saveEdit(task.id)}
                          className="rounded-xl bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="rounded-xl bg-slate-300 px-4 py-2 text-slate-900 hover:bg-slate-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <h3 className="text-xl font-semibold">{task.title}</h3>
                        <p className="mt-2 whitespace-pre-line text-slate-600">
                          {task.description || 'No description provided.'}
                        </p>
                        <p className="mt-3 text-sm text-slate-500">
                          Status: {task.status}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
                        <button
                          onClick={() => toggleStatus(task)}
                          className="rounded-xl bg-amber-500 px-4 py-2 text-white hover:bg-amber-600"
                        >
                          {task.status === 'completed'
                            ? 'Mark Pending'
                            : 'Mark Done'}
                        </button>

                        <button
                          onClick={() => startEdit(task)}
                          className="rounded-xl bg-slate-800 px-4 py-2 text-white hover:bg-slate-900"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => deleteTask(task.id)}
                          className="rounded-xl bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}