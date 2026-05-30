import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "../schemas";
import { useLogin } from "../hooks";
import { useNavigate, Link } from "react-router-dom";
import { getApiErrorMessage } from "../../../lib/apiError";

export default function LoginPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending, error: apiError } = useLogin();

  const onSubmit = (data: LoginFormData) => {
    mutate(data, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-blue-50 p-4 text-slate-900">
      <div className="w-full max-w-md rounded-2xl border border-blue-100 bg-white p-8 shadow-xl shadow-blue-100/80 transition-all duration-300 hover:border-blue-200">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-blue-950">
            Welcome Back
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Sign in to manage your shared expenses
          </p>
        </div>

        {apiError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {getApiErrorMessage(apiError, "Invalid email or password")}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Email Address
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="john@example.com"
              className="w-full rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Password
              </label>
            </div>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] hover:bg-blue-700 active:scale-[0.98] disabled:scale-100 disabled:opacity-50"
          >
            {isPending ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
          >
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
