import { Link } from "@tanstack/react-router";
import { RiMailSendLine } from "@remixicon/react";
import { Button } from "@/shared/components/common/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/shared/components/common/input-otp";
import { AnimateIn } from "@/shared/components/custom/AnimateIn";
import { getFieldError } from "@/shared/lib/form";
import type { useVerifyCodeModel } from "./VerifyCodeModel";

export type VerifyCodeViewProps = ReturnType<typeof useVerifyCodeModel>;

export function VerifyCodeView(props: VerifyCodeViewProps) {
  const { verifyCodeForm, resendCooldown } = props;
  const { form, isVerifying } = verifyCodeForm;
  const { cooldown, startCooldown } = resendCooldown;

  return (
    <div className="rounded-2xl border border-border bg-card px-10 py-10 shadow-[0_8px_40px_-12px_oklch(0_0_0/0.5)]">
      <AnimateIn delay={0}>
        <p className="mb-2 text-xs font-light tracking-[0.22em] text-muted-foreground uppercase">@Blog</p>
      </AnimateIn>

      <AnimateIn delay={80}>
        <h1 className="mb-3 text-[2rem] leading-tight font-light text-foreground/80">
          Verifique
          <br />
          seu email.
        </h1>
      </AnimateIn>

      <AnimateIn delay={140}>
        <p className="mb-8 flex items-center gap-2 text-xs text-muted-foreground">
          <RiMailSendLine size={14} className="shrink-0 text-primary" />
          Enviamos um código de 6 dígitos para o seu endereço de email.
        </p>
      </AnimateIn>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-6"
      >
        <AnimateIn delay={220}>
          <form.Field name="code">
            {(field) => (
              <div className="space-y-2">
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={field.state.value}
                    onChange={field.handleChange}
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
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-center text-xs text-destructive">
                    {getFieldError(field.state.meta.errors[0])}
                  </p>
                )}
              </div>
            )}
          </form.Field>
        </AnimateIn>

        <AnimateIn delay={320}>
          <Button type="submit" isLoading={isVerifying} className="w-full transition-opacity">
            Verificar
          </Button>
        </AnimateIn>
      </form>

      <AnimateIn delay={400}>
        <p className="mt-7 text-center text-xs text-muted-foreground">
          Não recebeu o código?{" "}
          {cooldown > 0 ? (
            <span className="text-muted-foreground/60 tabular-nums">Reenviar em {cooldown}s</span>
          ) : (
            <button
              type="button"
              onClick={startCooldown}
              className="text-primary transition-colors hover:text-primary/80"
            >
              Reenviar
            </button>
          )}
        </p>
      </AnimateIn>

      <AnimateIn delay={460}>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          <Link
            to="/auth/signin"
            className="text-muted-foreground/60 transition-colors hover:text-muted-foreground"
          >
            ← Voltar para o login
          </Link>
        </p>
      </AnimateIn>
    </div>
  );
}
