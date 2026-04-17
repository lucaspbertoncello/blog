import { Button } from "@/shared/components/common/button";
import { useAuthStore } from "@/domain/auth/stores/useAuthStore";
import { useShallow } from "zustand/react/shallow";
import { toast } from "sonner";

export function LogoutAction() {
  const { clearAuthTokens } = useAuthStore(
    useShallow((state) => ({ clearAuthTokens: state.clearAuthTokens }))
  );

  return (
    <Button
      variant="destructive"
      onClick={() => {
        clearAuthTokens();
        toast.success("Você deslogou de sua conta");
      }}
    >
      Sair
    </Button>
  );
}
