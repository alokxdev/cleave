import { Link } from "react-router-dom";
import { useGroups } from "../hooks";
import { getApiErrorMessage } from "../../../lib/apiError";

export default function GroupsPage() {
  const { data: groups, isLoading, error } = useGroups();

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent"></div>
        <p className="text-sm text-slate-500">Loading your groups...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-semibold text-red-600">Failed to load groups</p>
        <p className="mt-1 text-xs text-slate-500">{getApiErrorMessage(error, "Unknown error occurred")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-blue-950 sm:text-3xl">
            My Groups
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track and split bills with friends and family
          </p>
        </div>
        <Link
          to="/groups/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] hover:bg-blue-700 active:scale-[0.98]"
        >
          Create Group
        </Link>
      </div>

      {!groups || groups.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center rounded-2xl border border-dashed border-blue-200 bg-white p-8 text-center shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-500">
            👥
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-900">No groups found</h3>
          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Create an expense group to start splitting bills and settling balances.
          </p>
          <Link
            to="/groups/new"
            className="mt-6 rounded-lg border border-blue-100 bg-white px-5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm transition-colors hover:border-blue-200 hover:bg-blue-50"
          >
            Create your first group
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <Link
              key={group.id}
              to={`/groups/${group.id}`}
              className="group flex flex-col justify-between rounded-xl border border-blue-100 bg-white p-6 shadow-sm transition-all hover:scale-[1.01] hover:border-blue-200 hover:shadow-lg hover:shadow-blue-100/80"
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                    {group.name}
                  </h3>
                  <span className="text-[10px] text-slate-500">
                    Created {new Date(group.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-3 text-xs text-slate-500">
                  Group ID: <span className="font-mono text-slate-600">{group.id.slice(0, 8)}...</span>
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-blue-50 pt-4">
                <span className="text-xs text-slate-500 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                  View Balances & Expenses <span className="text-blue-600">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
