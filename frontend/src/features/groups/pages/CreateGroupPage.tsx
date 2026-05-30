import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createGroupSchema, type CreateGroupFormData } from "../schemas";
import { useCreateGroup } from "../hooks";
import { useNavigate, Link } from "react-router-dom";
import { getApiErrorMessage } from "../../../lib/apiError";

export default function CreateGroupPage() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateGroupFormData>({
    resolver: zodResolver(createGroupSchema),
  });

  const { mutate, isPending, error: apiError } = useCreateGroup();

  const onSubmit = (data: CreateGroupFormData) => {
    mutate(data, {
      onSuccess: () => {
        navigate("/");
      },
    });
  };

  return (
    <div className="mx-auto max-w-md animate-fade-in">
      <div className="mb-6">
        <Link
          to="/"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
        >
          ← Back to Groups
        </Link>
      </div>

      <div className="rounded-2xl border border-blue-100 bg-white p-8 shadow-lg shadow-blue-100/70">
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-blue-950">
            Create New Group
          </h1>
          <p className="mt-1.5 text-xs text-slate-500">
            Create an expense group to start splitting bills with friends.
          </p>
        </div>

        {apiError && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {getApiErrorMessage(apiError, "Failed to create group")}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
              Group Name
            </label>
            <input
              {...register("name")}
              placeholder="e.g. Ski Trip 2026, Roommates"
              className="w-full rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-400">{errors.name.message}</p>
            )}
          </div>

          <div className="flex gap-4 pt-2">
            <Link
              to="/"
              className="flex-1 rounded-lg border border-blue-100 bg-white py-2.5 text-center text-sm font-semibold text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:scale-[1.01] hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50"
            >
              {isPending ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
