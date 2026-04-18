import { Outlet } from "@tanstack/react-router";
import { AtmosphericDepth } from "@/shared/components/custom/AtmosphericDepth";
import { GrainOverlay } from "@/shared/components/custom/GrainOverlay";
import { VerticalGridLines } from "@/shared/components/custom/VerticalGridLines";

export function FeedLayout() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <AtmosphericDepth />
      <GrainOverlay />
      <VerticalGridLines />
      <Outlet />
    </div>
  );
}
