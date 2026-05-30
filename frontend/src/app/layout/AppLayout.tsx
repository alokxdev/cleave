import { Outlet, Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import { tokenStorage } from "../../services/tokenStorage";

export default function AppLayout() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    tokenStorage.clear();
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-200 selection:text-blue-950">
      {/* Header / Navbar */}
      <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/90 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link
            to="/"
            className="flex items-center gap-2.5 transition-transform hover:scale-[1.01]"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5"
                fill="none"
              >
                <path
                  d="M4 12h6.5c2.5 0 4.5-2 4.5-4.5V5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M4 12h6.5c2.5 0 4.5 2 4.5 4.5V19"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.5 5h2.8c1.5 0 2.7 1.2 2.7 2.7v2.8"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12.5 19h2.8c1.5 0 2.7-1.2 2.7-2.7v-2.8"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-blue-950">
              Cleave
            </span>
          </Link>

          {user && (
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-slate-500">@{user.username}</p>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-lg border border-blue-100 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-[0.98]"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
