import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { TooltipProvider } from "@/shared/components/common/tooltip";

import "./index.css";
import "highlight.js/styles/github-dark.css";
import { router } from "./router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <RouterProvider router={router} />
    </TooltipProvider>
  </StrictMode>
);
