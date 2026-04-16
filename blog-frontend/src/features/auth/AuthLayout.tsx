import { Outlet } from "@tanstack/react-router"
import { cn } from "@/shared/lib/utils"

export function AuthLayout() {
  return (
    <div className="relative flex min-h-screen bg-background">

      {/* Dot pattern */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#404040_1px,transparent_1px)]",
        )}
      />
      {/* Radial mask — fades dots toward center */}
      <div className="pointer-events-none absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      {/* Left — illustration placeholder */}
      <div className="relative z-10 hidden flex-1 items-center justify-center lg:flex">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border/40 px-16 py-12 text-center">
          <div className="flex size-14 items-center justify-center rounded-full border border-border/40">
            <svg
              className="size-6 text-muted-foreground/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.2}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
          <p className="text-xs tracking-widest text-muted-foreground/30 uppercase">
            Ilustração em breve
          </p>
        </div>
      </div>

      {/* Right — form via Outlet */}
      <div className="relative z-10 flex w-full items-center justify-end pr-[12%] lg:w-1/2">
        <div className="w-full max-w-100">
          <Outlet />
        </div>
      </div>

    </div>
  )
}
