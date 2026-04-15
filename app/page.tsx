import Link from 'next/link'

const features = [
  {
    title: 'Organize Work Easily',
    description:
      'Create, manage, update, and track tasks from one clean dashboard.',
  },
  {
    title: 'Secure User Access',
    description:
      'Each user signs in and sees only their own tasks using Supabase authentication.',
  },
  {
    title: 'Responsive Experience',
    description:
      'Built to work smoothly on desktop, tablet, and mobile devices.',
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="mx-auto flex max-w-7xl flex-col items-center px-6 py-20 text-center md:py-28">
        <span className="mb-4 rounded-full bg-blue-100 px-4 py-1 text-sm font-medium text-blue-700">
          Full-Stack Task Manager
        </span>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
          Manage tasks smarter with a clean, secure dashboard
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
          A full-stack task management application built with Next.js and
          Supabase. Sign up, log in, create tasks, update status, edit details,
          and stay organized across all devices.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="rounded-xl bg-blue-600 px-6 py-3 text-white shadow hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 hover:bg-slate-100"
          >
            Login
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <h2 className="text-xl font-semibold">{feature.title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-center md:flex-row md:text-left">
          <div>
            <h3 className="text-lg font-semibold">Ready to manage your work?</h3>
            <p className="text-sm text-slate-600">
              Create an account and start using the dashboard today.
            </p>
          </div>

          <Link
            href="/signup"
            className="rounded-xl bg-slate-900 px-5 py-3 text-white hover:bg-slate-800"
          >
            Create Account
          </Link>
        </div>
      </section>
    </main>
  )
}