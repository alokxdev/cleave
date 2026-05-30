import { useEffect, useState, type ReactNode } from "react";
import { apiClient } from "../../services/apiClient";
import { useAuthStore } from "../../store/auth.store";
import { tokenStorage } from "../../services/tokenStorage";

type Props = {
  children: ReactNode;
};

export default function AuthProvider({ children }: Props) {
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = tokenStorage.getAccessToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await apiClient.get("/api/user/me");
        setUser(res.data.data);
      } catch (err) {
        console.error("Auth init failed:", err);
        tokenStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [setUser]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-blue-50 text-slate-700">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-sm font-medium tracking-wide">Initializing Cleave...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
