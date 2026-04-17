import { Outlet } from "@tanstack/react-router"
import { cn } from "@/shared/lib/utils"

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background">

      {/* Grid pattern */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          "[background-size:40px_40px]",
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />
      {/* Radial mask — fades grid toward center */}
      <div className="pointer-events-none absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="relative z-10 w-full max-w-md px-4">
        <Outlet />
      </div>

    </div>
  )
}
