import { RiArrowLeftLine } from "@remixicon/react";
import { Link } from "@tanstack/react-router";

import { Button } from "@/shared/components/common/button";
import { AnimateIn } from "@/shared/components/custom/AnimateIn";
import { AtmosphericDepth } from "@/shared/components/custom/AtmosphericDepth";
import { GrainOverlay } from "@/shared/components/custom/GrainOverlay";
import { VerticalGridLines } from "@/shared/components/custom/VerticalGridLines";

export function NotFoundPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <AtmosphericDepth />
      <GrainOverlay />
      <VerticalGridLines />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-250 flex-col px-6 sm:px-12">
        <AnimateIn delay={0}>
          <header className="flex items-center justify-between border-b border-border py-6 sm:py-9">
            <span className="font-sans text-base font-light tracking-tight">
              dev<span className="text-primary">.</span>blog
            </span>
            <span className="font-inter text-[11px] uppercase tracking-widest text-muted-foreground">
              404 / Not Found
            </span>
          </header>
        </AnimateIn>

        <main className="flex flex-1 items-center py-12 sm:py-16">
          <div className="grid w-full gap-10 lg:grid-cols-2 lg:gap-16">
            <AnimateIn delay={80}>
              <section className="relative overflow-hidden border border-border bg-background/80 p-6 sm:p-8">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-6 right-6 flex size-24 items-center justify-center sm:size-32"
                >
                  <div className="absolute inset-0 rounded-full border border-primary/25 motion-safe:animate-spin" />
                  <div className="absolute inset-4 rounded-full border border-foreground/10 motion-safe:animate-pulse" />
                  <div className="size-2 rounded-full bg-primary/70" />
                </div>

                <p className="font-inter text-xs uppercase tracking-widest text-muted-foreground">
                  Caminho indisponivel
                </p>

                <div className="mt-4 flex flex-col gap-3">
                  <span className="font-sans text-7xl font-light leading-none sm:text-9xl">404</span>

                  <h1 className="max-w-xl font-sans text-3xl font-bold tracking-tight text-balance sm:text-5xl">
                    Essa rota saiu do mapa.
                  </h1>

                  <p className="max-w-xl font-inter text-sm leading-6 text-muted-foreground sm:text-base">
                    A URL que voce tentou abrir nao existe, mudou de lugar ou ainda nao foi criada nesta
                    app.
                  </p>
                </div>
              </section>
            </AnimateIn>

            <AnimateIn delay={180}>
              <section className="flex h-full flex-col justify-end gap-8">
                <div className="grid gap-3 border-t border-border pt-6">
                  <p className="font-inter text-xs uppercase tracking-widest text-muted-foreground">
                    Proximo passo
                  </p>
                  <p className="max-w-xl font-inter text-sm leading-6 text-muted-foreground sm:text-base">
                    Volte para o feed e continue navegando pela aplicacao. Se voce digitou a URL na mao,
                    vale conferir o endereco.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="sm:min-w-44">
                    <Link to="/">
                      <RiArrowLeftLine className="size-4" />
                      Voltar ao feed
                    </Link>
                  </Button>

                  <Button asChild variant="ghost" size="lg" className="justify-start sm:min-w-44">
                    <Link to="/auth/signin">Ir para login</Link>
                  </Button>
                </div>

                <div className="border-t border-border pt-6">
                  <p className="max-w-xl font-inter text-xs uppercase tracking-widest text-muted-foreground">
                    404 / pagina nao encontrada
                  </p>
                </div>
              </section>
            </AnimateIn>
          </div>
        </main>
      </div>
    </div>
  );
}
