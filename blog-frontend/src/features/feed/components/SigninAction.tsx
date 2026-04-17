import { Button } from "@/shared/components/common/button";
import { Link } from "@tanstack/react-router";

export function SigninAction() {
  return (
    <Link from="/" to="/auth/signin">
      <Button>Entrar</Button>
    </Link>
  );
}
