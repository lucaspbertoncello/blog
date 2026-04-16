import { cn } from "@/shared/lib/utils"
import type { ReactNode } from "react"

interface AnimateInProps {
  delay?: number
  children: ReactNode
  className?: string
}

export function AnimateIn({ delay = 0, children, className }: AnimateInProps) {
  return (
    <div
      className={cn("animate-in fade-in slide-in-from-bottom-3 duration-500", className)}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      {children}
    </div>
  )
}
