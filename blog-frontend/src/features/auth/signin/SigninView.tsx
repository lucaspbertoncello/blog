import { RiMailLine, RiLockLine, RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/shared/components/common/button";
import { Input } from "@/shared/components/common/input";
import { Label } from "@/shared/components/common/label";
import { AnimateIn } from "@/shared/components/custom/AnimateIn";
import { getFieldError } from "@/shared/lib/form";
import type { useSigninModel } from "./SigninModel";

export type SigninViewProps = ReturnType<typeof useSigninModel>;

export function SigninView(props: SigninViewProps) {
  const { signinForm, passwordVisibilityControl } = props;

  const { showPassword, setShowPassword } = passwordVisibilityControl;
  const { form, isSigningIn } = signinForm;

  return (
    <div className="rounded-2xl border border-border bg-card px-10 py-10 shadow-[0_8px_40px_-12px_oklch(0_0_0/0.5)]">
      <AnimateIn delay={0}>
        <p className="mb-2 text-xs font-light tracking-[0.22em] text-muted-foreground uppercase">@Blog</p>
      </AnimateIn>

      <AnimateIn delay={80}>
        <h1 className="mb-9 text-[2rem] leading-tight font-light text-foreground/80">
          Entre na
          <br />
          sua conta.
        </h1>
      </AnimateIn>

      <form
        className="space-y-3"
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
      >
        <AnimateIn delay={180}>
          <form.Field name="email">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs text-muted-foreground">
                  Email
                </Label>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                    <RiMailLine size={15} />
                  </span>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="seu@email.com"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="pl-9 transition-colors focus-visible:border-primary focus-visible:ring-0"
                  />
                </div>
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">{getFieldError(field.state.meta.errors[0])}</p>
                )}
              </div>
            )}
          </form.Field>
        </AnimateIn>

        <AnimateIn delay={260}>
          <form.Field name="password">
            {(field) => (
              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs text-muted-foreground">
                  Senha
                </Label>
                <div className="relative">
                  <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                    <RiLockLine size={15} />
                  </span>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="pr-9 pl-9 transition-colors focus-visible:border-primary focus-visible:ring-0"
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    {showPassword ? <RiEyeOffLine size={15} /> : <RiEyeLine size={15} />}
                  </button>
                </div>
                {field.state.meta.isTouched && field.state.meta.errors.length > 0 && (
                  <p className="text-xs text-destructive">{getFieldError(field.state.meta.errors[0])}</p>
                )}
              </div>
            )}
          </form.Field>
        </AnimateIn>

        <AnimateIn delay={340}>
          <Button type="submit" className="mt-1 w-full transition-opacity" isLoading={isSigningIn}>
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
  );
}
