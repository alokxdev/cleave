import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";

import { useAuthStore } from "../../store/auth.store";

type Props = {
  children: ReactNode;
};

export default function PublicRoute({ children }: Props) {
  const user = useAuthStore((state) => state.user);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
