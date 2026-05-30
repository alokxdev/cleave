import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormData } from "../schemas";
import { useRegister } from "../hooks";
import { useNavigate, Link } from "react-router-dom";
import { getApiErrorMessage } from "../../../lib/apiError";

export default function RegisterPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate, isPending, error: apiError } = useRegister();

  const onSubmit = (data: RegisterFormData) => {
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
            Create Account
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Join Cleave to start sharing expenses seamlessly
          </p>
        </div>

        {apiError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {getApiErrorMessage(apiError, "Registration failed")}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Username
            </label>
            <input
              {...register("username")}
              placeholder="johndoe"
              className="w-full rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-400">{errors.username.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                First Name
              </label>
              <input
                {...register("firstName")}
                placeholder="John"
                className="w-full rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              {errors.firstName && (
                <p className="mt-1 text-xs text-red-400">{errors.firstName.message}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Last Name
              </label>
              <input
                {...register("lastName")}
                placeholder="Doe"
                className="w-full rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
              {errors.lastName && (
                <p className="mt-1 text-xs text-red-400">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="john@example.com"
              className="w-full rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            <p className="mt-1 text-[10px] text-slate-500">
              Must be 8-10 chars with 1 uppercase, 1 lowercase, and 1 number.
            </p>
            {errors.password && (
              <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] hover:bg-blue-700 active:scale-[0.98] disabled:scale-100 disabled:opacity-50"
          >
            {isPending ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
