export function VerticalGridLines() {
  return (
    <>
      <div className="pointer-events-none fixed top-0 bottom-0 left-[calc(50%-500px)] z-0 w-px bg-muted-foreground/20" />
      <div className="pointer-events-none fixed top-0 right-[calc(50%-500px)] bottom-0 z-0 w-px bg-muted-foreground/20" />
    </>
  );
}
