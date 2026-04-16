import { useState } from "react"
import { RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine } from "@remixicon/react"
import { Link } from "@tanstack/react-router"
import { Button } from "@/shared/components/common/button"
import { Input } from "@/shared/components/common/input"
import { Label } from "@/shared/components/common/label"
import { AnimateIn } from "@/shared/components/custom/AnimateIn"

export function SigninView() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="dot-grid relative flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-[340px] px-6">

        <AnimateIn delay={0}>
          <p className="mb-2 text-xs font-light tracking-[0.22em] uppercase text-muted-foreground">
            @Blog
          </p>
        </AnimateIn>

        <AnimateIn delay={80}>
          <h1 className="mb-9 text-[2rem] font-light leading-tight text-foreground/80">
            Entre na<br />sua conta.
          </h1>
        </AnimateIn>

        <form className="space-y-3">
          <AnimateIn delay={180}>
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs text-muted-foreground">
                Email
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <RiMailLine size={15} />
                </span>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  className="pl-9 transition-colors focus-visible:ring-0 focus-visible:border-primary"
                />
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={260}>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs text-muted-foreground">
                Senha
              </Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <RiLockLine size={15} />
                </span>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="pl-9 pr-9 transition-colors focus-visible:ring-0 focus-visible:border-primary"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <RiEyeOffLine size={15} /> : <RiEyeLine size={15} />}
                </button>
              </div>
            </div>
          </AnimateIn>

          <AnimateIn delay={340}>
            <Button
              type="submit"
              className="mt-1 w-full transition-opacity hover:opacity-90 active:opacity-80"
            >
              Entrar
            </Button>
          </AnimateIn>
        </form>

        <AnimateIn delay={420}>
          <p className="mt-7 text-center text-xs text-muted-foreground">
            Não tem conta?{" "}
            <Link to="/signup" className="text-primary transition-colors hover:text-primary/80">
              Cadastrar
            </Link>
          </p>
        </AnimateIn>

      </div>
    </div>
  )
}
