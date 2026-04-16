import { useState, useEffect } from "react"
import { Link } from "@tanstack/react-router"
import { RiMailSendLine } from "@remixicon/react"
import { Button } from "@/shared/components/common/button"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/components/common/input-otp"
import { AnimateIn } from "@/shared/components/custom/AnimateIn"

const RESEND_COOLDOWN = 60

export function VerifyCodeView() {
  const [value, setValue] = useState("")
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  function handleResend() {
    setCooldown(RESEND_COOLDOWN)
  }

  return (
    <div className="dot-grid relative flex min-h-screen items-center bg-background">
      <div className="ml-auto mr-[12%] w-full max-w-100">
        <div className="rounded-2xl border border-border bg-card px-10 py-10 shadow-[0_8px_40px_-12px_oklch(0_0_0/0.5)]">

          <AnimateIn delay={0}>
            <p className="mb-2 text-xs font-light tracking-[0.22em] uppercase text-muted-foreground">
              @Blog
            </p>
          </AnimateIn>

          <AnimateIn delay={80}>
            <h1 className="mb-3 text-[2rem] font-light leading-tight text-foreground/80">
              Verifique<br />seu email.
            </h1>
          </AnimateIn>

          <AnimateIn delay={140}>
            <p className="mb-8 flex items-center gap-2 text-xs text-muted-foreground">
              <RiMailSendLine size={14} className="shrink-0 text-primary" />
              Enviamos um código de 6 dígitos para o seu endereço de email.
            </p>
          </AnimateIn>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            <AnimateIn delay={220}>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={value}
                  onChange={setValue}
                  containerClassName="gap-2"
                >
                  <InputOTPGroup className="gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="size-12 rounded-lg border border-border bg-background text-base first:rounded-l-lg first:border-l last:rounded-r-lg"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </AnimateIn>

            <AnimateIn delay={320}>
              <Button
                type="submit"
                disabled={value.length < 6}
                className="w-full transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Verificar
              </Button>
            </AnimateIn>
          </form>

          <AnimateIn delay={400}>
            <p className="mt-7 text-center text-xs text-muted-foreground">
              Não recebeu o código?{" "}
              {cooldown > 0 ? (
                <span className="tabular-nums text-muted-foreground/60">
                  Reenviar em {cooldown}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-primary transition-colors hover:text-primary/80"
                >
                  Reenviar
                </button>
              )}
            </p>
          </AnimateIn>

          <AnimateIn delay={460}>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              <Link to="/signin" className="text-muted-foreground/60 transition-colors hover:text-muted-foreground">
                ← Voltar para o login
              </Link>
            </p>
          </AnimateIn>

        </div>
      </div>
    </div>
  )
}
