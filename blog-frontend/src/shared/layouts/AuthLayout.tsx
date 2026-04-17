import { Outlet } from "@tanstack/react-router"

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background">

      {/* Grid pattern */}
      <div className="bg-grid pointer-events-none absolute inset-0" />
      {/* Radial mask — fades grid toward center */}
      <div className="bg-grid-mask pointer-events-none absolute inset-0 bg-background" />

      <div className="relative z-10 w-full max-w-md px-4">
        <Outlet />
      </div>

    </div>
  )
}
