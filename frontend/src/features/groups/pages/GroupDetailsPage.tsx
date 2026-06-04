import { useParams, Link, useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

import {
  useGroup,
  useGroupMembers,
  useUpdateGroup,
  useDeleteGroup,
  useAddGroupMember,
  useRemoveGroupMember,
  useGroupBalances,
} from "../hooks";
import {
  useGroupExpenses,
  useCreateExpense,
  useUpdateExpense,
  useDeleteExpense,
} from "../../expenses/hooks";
import { addMemberSchema, type AddMemberFormData } from "../schemas";
import { createExpenseFormSchema, type CreateExpenseFormData } from "../../expenses/schemas";
import type { CreateExpenseInput } from "../../expenses/types";
import { useAuthStore } from "../../../store/auth.store";
import { getApiErrorMessage } from "../../../lib/apiError";

export default function GroupDetailsPage() {
  const { groupId } = useParams<{ groupId: string }>() as { groupId: string };
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);

  // States
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [expenseFormError, setExpenseFormError] = useState<string | null>(null);
  const [exactSplitAmounts, setExactSplitAmounts] = useState<Record<string, string>>({});
  const [isEditingGroupName, setIsEditingGroupName] = useState(false);
  const [groupNameDraft, setGroupNameDraft] = useState("");
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null);
  const [editingDescription, setEditingDescription] = useState("");

  // Queries
  const { data: group, isLoading: loadingGroup } = useGroup(groupId);
  const { data: members, isLoading: loadingMembers } = useGroupMembers(groupId);
  const { data: expenses, isLoading: loadingExpenses } = useGroupExpenses(groupId);
  const { data: balances, isLoading: loadingBalances } = useGroupBalances(groupId);

  // Mutations
  const { mutate: updateGroupMutate, isPending: updatingGroup, error: updateGroupError, reset: resetUpdateGroupError } = useUpdateGroup(groupId);
  const { mutate: deleteGroupMutate, isPending: deletingGroup, error: deleteGroupError, reset: resetDeleteGroupError } = useDeleteGroup();
  const { mutate: addMemberMutate, isPending: addingMember, error: addMemberError, reset: resetAddMemberError } = useAddGroupMember(groupId);
  const { mutate: removeMemberMutate, isPending: removingMember, error: removeMemberError, reset: resetRemoveMemberError } = useRemoveGroupMember(groupId);
  const { mutate: createExpenseMutate, isPending: creatingExpense, error: createExpenseError, reset: resetCreateExpenseError } = useCreateExpense(groupId);
  const { mutate: updateExpenseMutate, isPending: updatingExpense, error: updateExpenseError, reset: resetUpdateExpenseError } = useUpdateExpense(groupId);
  const { mutate: deleteExpenseMutate, isPending: deletingExpense, error: deleteExpenseError, reset: resetDeleteExpenseError } = useDeleteExpense(groupId);

  // Forms
  const {
    register: registerMember,
    handleSubmit: handleMemberSubmit,
    reset: resetMemberForm,
    formState: { errors: memberErrors },
  } = useForm<AddMemberFormData>({
    resolver: zodResolver(addMemberSchema),
  });

  const {
    register: registerExpense,
    control: expenseControl,
    handleSubmit: handleExpenseSubmit,
    reset: resetExpenseForm,
    setValue: setExpenseValue,
    formState: { errors: expenseErrors },
  } = useForm<CreateExpenseFormData>({
    resolver: zodResolver(createExpenseFormSchema),
    defaultValues: {
      splitType: "EQUAL",
      paidBy: currentUser?.id || "",
      participants: [],
    },
  });

  const selectedParticipants = useWatch({
    control: expenseControl,
    name: "participants",
  }) || [];
  const selectedSplitType = useWatch({
    control: expenseControl,
    name: "splitType",
  });

  const handleAddMember = (data: AddMemberFormData) => {
    resetAddMemberError();
    addMemberMutate(data, {
      onSuccess: () => {
        resetMemberForm();
      },
    });
  };

  const currentMembership = members?.find((m) => m.user.id === currentUser?.id);
  const isGroupOwner = currentMembership?.role === "OWNER";

  const startEditingGroupName = () => {
    resetUpdateGroupError();
    setGroupNameDraft(group?.name || "");
    setIsEditingGroupName(true);
  };

  const cancelEditingGroupName = () => {
    resetUpdateGroupError();
    setGroupNameDraft("");
    setIsEditingGroupName(false);
  };

  const handleUpdateGroupName = () => {
    const name = groupNameDraft.trim();

    if (!name) {
      return;
    }

    resetUpdateGroupError();
    updateGroupMutate(
      { name },
      {
        onSuccess: () => {
          setIsEditingGroupName(false);
          setGroupNameDraft("");
        },
      },
    );
  };

  const handleDeleteGroup = () => {
    resetDeleteGroupError();

    if (!window.confirm("Delete this group and all of its expenses? This cannot be undone.")) {
      return;
    }

    deleteGroupMutate(groupId, {
      onSuccess: () => navigate("/"),
    });
  };

  const handleRemoveMember = (userId: string) => {
    resetRemoveMemberError();

    if (!window.confirm("Remove this member from the group?")) {
      return;
    }

    removeMemberMutate(userId);
  };

  const handleAddExpense = (data: CreateExpenseFormData) => {
    resetCreateExpenseError();
    setExpenseFormError(null);

    const basePayload = {
      description: data.description,
      amount: Number(data.amount),
      paidBy: data.paidBy,
      splitType: data.splitType,
    };

    const exactSplits = (data.participants || []).map((userId) => ({
      userId,
      amount: Number(exactSplitAmounts[userId] || 0),
    }));

    if (data.splitType === "EXACT") {
      const splitTotalInCents = exactSplits.reduce(
        (sum, split) => sum + Math.round(split.amount * 100),
        0,
      );
      const expenseTotalInCents = Math.round(Number(data.amount) * 100);

      if (exactSplits.some((split) => split.amount <= 0)) {
        setExpenseFormError("Each exact split amount must be greater than zero.");
        return;
      }

      if (splitTotalInCents !== expenseTotalInCents) {
        setExpenseFormError("Exact split amounts must add up to the expense total.");
        return;
      }
    }

    const payload: CreateExpenseInput =
      data.splitType === "EXACT"
        ? {
          ...basePayload,
          splitType: "EXACT",
          splits: exactSplits,
        }
        : {
          ...basePayload,
          splitType: "EQUAL",
          participants: data.participants,
        };

    createExpenseMutate(payload, {
      onSuccess: () => {
        resetExpenseForm({
          description: "",
          amount: 0,
          paidBy: currentUser?.id || "",
          splitType: "EQUAL",
          participants: [],
        });
        setExactSplitAmounts({});
        setShowAddExpense(false);
      },
    });
  };

  const startEditingExpense = (expenseId: string, description: string | null) => {
    resetUpdateExpenseError();
    setEditingExpenseId(expenseId);
    setEditingDescription(description || "");
  };

  const cancelEditingExpense = () => {
    resetUpdateExpenseError();
    setEditingExpenseId(null);
    setEditingDescription("");
  };

  const handleUpdateExpense = (expenseId: string) => {
    const description = editingDescription.trim();

    if (!description) {
      return;
    }

    resetUpdateExpenseError();
    updateExpenseMutate(
      { expenseId, data: { description } },
      {
        onSuccess: () => {
          setEditingExpenseId(null);
          setEditingDescription("");
        },
      },
    );
  };

  const handleDeleteExpense = (expenseId: string) => {
    resetDeleteExpenseError();

    if (!window.confirm("Delete this expense? This cannot be undone.")) {
      return;
    }

    deleteExpenseMutate(expenseId);
  };

  // Helper mappings
  const memberMap = new Map(
    members?.map((m) => [m.user.id, `${m.user.firstName} ${m.user.lastName}`])
  );

  const getMemberEmail = (userId: string) => {
    const member = members?.find((m) => m.user.id === userId);
    return member ? member.user.email : "";
  };

  const isLoading = loadingGroup || loadingMembers || loadingExpenses || loadingBalances;

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-600 border-t-transparent"></div>
        <p className="text-sm text-slate-500">Loading group details...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="text-sm font-semibold text-red-600">Group not found</p>
        <Link to="/" className="mt-4 inline-block text-xs text-blue-600 hover:underline">
          Back to groups
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col gap-4 border-b border-blue-100 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1 mb-2"
          >
            ← Back to Groups
          </Link>
          {isEditingGroupName ? (
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                value={groupNameDraft}
                onChange={(event) => setGroupNameDraft(event.target.value)}
                className="w-full rounded-lg border border-blue-100 bg-white px-3 py-2 text-2xl font-extrabold tracking-tight text-blue-950 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-80"
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleUpdateGroupName}
                  disabled={updatingGroup || !groupNameDraft.trim()}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={cancelEditingGroupName}
                  className="rounded-lg border border-blue-100 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <h1 className="text-3xl font-extrabold tracking-tight text-blue-950">
              {group.name}
            </h1>
          )}
          <p className="mt-1 text-xs text-slate-500">
            Group ID: <span className="font-mono text-slate-600">{group.id}</span>
          </p>
          {updateGroupError && (
            <p className="mt-2 text-xs font-medium text-red-600">
              {getApiErrorMessage(updateGroupError, "Failed to update group")}
            </p>
          )}
          {deleteGroupError && (
            <p className="mt-2 text-xs font-medium text-red-600">
              {getApiErrorMessage(deleteGroupError, "Failed to delete group")}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {isGroupOwner && !isEditingGroupName && (
            <>
              <button
                type="button"
                onClick={startEditingGroupName}
                className="inline-flex items-center justify-center rounded-lg border border-blue-100 bg-white px-4 py-2.5 text-sm font-semibold text-blue-600 shadow-sm transition-all hover:border-blue-200 hover:bg-blue-50"
              >
                Rename Group
              </button>
              <button
                type="button"
                onClick={handleDeleteGroup}
                disabled={deletingGroup}
                className="inline-flex items-center justify-center rounded-lg border border-red-100 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 shadow-sm transition-all hover:bg-red-50 disabled:opacity-50"
              >
                Delete Group
              </button>
            </>
          )}
          <button
            onClick={() => {
              setShowAddExpense(!showAddExpense);
              // Pre-select all members when opening the form
              if (members) {
                setExpenseValue("participants", members.map((m) => m.user.id));
              }
            }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-[1.02] hover:bg-blue-700 active:scale-[0.98]"
          >
            {showAddExpense ? "Close Form" : "Add Expense"}
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Columns - Expenses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Expense Form */}
          {showAddExpense && (
            <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-lg shadow-blue-100/70 animate-slide-down">
              <h3 className="text-lg font-bold text-blue-950 mb-4">Log a New Expense</h3>

              {createExpenseError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {getApiErrorMessage(createExpenseError, "Failed to create expense")}
                </div>
              )}

              {expenseFormError && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                  {expenseFormError}
                </div>
              )}

              <form onSubmit={handleExpenseSubmit(handleAddExpense)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Description
                    </label>
                    <input
                      {...registerExpense("description")}
                      placeholder="e.g. Dinner, Groceries"
                      className="w-full rounded-lg border border-blue-100 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    {expenseErrors.description && (
                      <p className="mt-1 text-xs text-red-400">{expenseErrors.description.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Amount ($)
                    </label>
                    <input
                      {...registerExpense("amount", { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="w-full rounded-lg border border-blue-100 bg-white px-4 py-2 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                    {expenseErrors.amount && (
                      <p className="mt-1 text-xs text-red-400">{expenseErrors.amount.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Paid By
                    </label>
                    <select
                      {...registerExpense("paidBy")}
                      className="w-full rounded-lg border border-blue-100 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      {members?.map((m) => (
                        <option key={m.user.id} value={m.user.id}>
                          {m.user.firstName} {m.user.lastName} ({m.user.email})
                        </option>
                      ))}
                    </select>
                    {expenseErrors.paidBy && (
                      <p className="mt-1 text-xs text-red-400">{expenseErrors.paidBy.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                      Split Type
                    </label>
                    <select
                      {...registerExpense("splitType")}
                      className="w-full rounded-lg border border-blue-100 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    >
                      <option value="EQUAL">Split Equally</option>
                      <option value="EXACT">Exact Amounts</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                    Participants to Split With
                  </label>
                  <div className="max-h-40 overflow-y-auto rounded-lg border border-blue-100 bg-blue-50/50 p-3 space-y-2.5">
                    {members?.map((m) => (
                      <div key={m.user.id} className="flex flex-col gap-2 rounded-lg bg-white p-2 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between">
                        <label className="flex cursor-pointer items-center gap-3 hover:text-blue-700">
                          <input
                            type="checkbox"
                            value={m.user.id}
                            checked={selectedParticipants.includes(m.user.id)}
                            onChange={(e) => {
                              const current = [...selectedParticipants];
                              if (e.target.checked) {
                                current.push(m.user.id);
                              } else {
                                const index = current.indexOf(m.user.id);
                                if (index > -1) current.splice(index, 1);
                                setExactSplitAmounts((amounts) => {
                                  const nextAmounts = { ...amounts };
                                  delete nextAmounts[m.user.id];
                                  return nextAmounts;
                                });
                              }
                              setExpenseValue("participants", current);
                            }}
                            className="h-4 w-4 rounded border-blue-200 bg-white text-blue-600 focus:ring-blue-100 accent-blue-600"
                          />
                          <span>{m.user.firstName} {m.user.lastName} ({m.user.email})</span>
                        </label>
                        {selectedSplitType === "EXACT" && selectedParticipants.includes(m.user.id) && (
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="0.00"
                            value={exactSplitAmounts[m.user.id] || ""}
                            onChange={(event) =>
                              setExactSplitAmounts((amounts) => ({
                                ...amounts,
                                [m.user.id]: event.target.value,
                              }))
                            }
                            className="w-full rounded-lg border border-blue-100 bg-white px-3 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:w-28"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  {expenseErrors.participants && (
                    <p className="mt-1 text-xs text-red-400">{expenseErrors.participants.message}</p>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddExpense(false)}
                    className="rounded-lg border border-blue-100 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingExpense}
                    className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:scale-[1.01] hover:bg-blue-700 active:scale-[0.99] disabled:opacity-50"
                  >
                    {creatingExpense ? "Saving..." : "Save Expense"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Expense List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-blue-950">Expense History</h2>

            {updateExpenseError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {getApiErrorMessage(updateExpenseError, "Failed to update expense")}
              </div>
            )}

            {deleteExpenseError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {getApiErrorMessage(deleteExpenseError, "Failed to delete expense")}
              </div>
            )}

            {!expenses || expenses.length === 0 ? (
              <div className="rounded-xl border border-blue-100 bg-white p-8 text-center shadow-sm">
                <p className="text-sm text-slate-500">No expenses logged yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {expenses.map((expense) => {
                  const splitsList = expense.splits.map((s) => {
                    const name = memberMap.get(s.userId) || s.userId;
                    return `${name} ($${Number(s.amountOwed).toFixed(2)})`;
                  }).join(", ");
                  const canManageExpense = expense.paidById === currentUser?.id;
                  const isEditingExpense = editingExpenseId === expense.id;

                  return (
                    <div
                      key={expense.id}
                      className="rounded-xl border border-blue-100 bg-white p-5 flex flex-col justify-between gap-4 shadow-sm transition-all hover:border-blue-200 hover:shadow-md hover:shadow-blue-100/70 sm:flex-row sm:items-center sm:gap-6"
                    >
                      <div className="space-y-1">
                        {isEditingExpense ? (
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <input
                              value={editingDescription}
                              onChange={(event) => setEditingDescription(event.target.value)}
                              className="w-full rounded-lg border border-blue-100 bg-white px-3 py-2 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleUpdateExpense(expense.id)}
                                disabled={updatingExpense || !editingDescription.trim()}
                                className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={cancelEditingExpense}
                                className="rounded-lg border border-blue-100 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <h4 className="text-base font-bold text-slate-900">
                            {expense.description || "Unspecified Expense"}
                          </h4>
                        )}
                        <p className="text-xs text-slate-500">
                          Paid by <span className="font-semibold text-slate-700">{expense.paidBy.firstName} {expense.paidBy.lastName}</span> on {new Date(expense.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-md">
                          <span className="font-medium text-slate-500">Splits:</span> {splitsList}
                        </p>
                      </div>

                      <div className="text-right flex sm:flex-col justify-between items-center sm:items-end">
                        <span className="text-lg font-black text-blue-600">
                          ${Number(expense.amount).toFixed(2)}
                        </span>
                        <span className="text-[10px] font-mono text-slate-600 block mt-1">
                          ID: {expense.id.slice(0, 8)}
                        </span>
                        {canManageExpense && !isEditingExpense && (
                          <div className="mt-3 flex gap-2">
                            <button
                              type="button"
                              onClick={() => startEditingExpense(expense.id, expense.description)}
                              className="rounded-lg border border-blue-100 bg-white px-3 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-50"
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteExpense(expense.id)}
                              disabled={deletingExpense}
                              className="rounded-lg border border-red-100 bg-white px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Members & Balances */}
        <div className="space-y-6">
          {/* Balances / Who owes Whom */}
          <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-blue-950 mb-4">Group Balances</h3>

            {!balances || balances.length === 0 ? (
              <div className="py-4 text-center">
                <div className="text-2xl mb-1">🎉</div>
                <p className="text-xs text-slate-500 font-medium">All balances are settled!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {balances.map((balance, index) => {
                  const fromName = memberMap.get(balance.from) || getMemberEmail(balance.from) || "Unknown";
                  const toName = memberMap.get(balance.to) || getMemberEmail(balance.to) || "Unknown";

                  return (
                    <div
                      key={index}
                      className="rounded-lg border border-blue-100 bg-blue-50/60 p-3.5 flex items-center justify-between text-sm"
                    >
                      <div className="space-y-0.5">
                        <span className="font-semibold text-slate-900">{fromName}</span>
                        <span className="text-xs text-slate-500 block">owes {toName}</span>
                      </div>
                      <span className="font-bold text-blue-600">
                        ${balance.amount.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Members List */}
          <div className="rounded-2xl border border-blue-100 bg-white p-6 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold text-blue-950 mb-4">Members ({members?.length || 0})</h3>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {members?.map((m) => (
                  <div key={m.id} className="flex items-center justify-between text-sm py-1 border-b border-blue-50 last:border-0 pb-2">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {m.user.firstName} {m.user.lastName}
                        {m.role === "OWNER" && (
                          <span className="ml-2 rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-600 border border-blue-100">
                            Owner
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-500">@{m.user.username}</p>
                    </div>
                    {isGroupOwner && m.user.id !== currentUser?.id && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(m.user.id)}
                        disabled={removingMember}
                        className="rounded-lg border border-red-100 bg-white px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Add Member Form */}
            <div className="border-t border-blue-100 pt-4 space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Add Group Member
              </h4>

              {addMemberError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
                  {getApiErrorMessage(addMemberError, "Failed to add member")}
                </div>
              )}

              {removeMemberError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
                  {getApiErrorMessage(removeMemberError, "Failed to remove member")}
                </div>
              )}

              <form onSubmit={handleMemberSubmit(handleAddMember)} className="flex gap-2">
                <div className="flex-1">
                  <input
                    {...registerMember("email")}
                    type="email"
                    placeholder="friend@email.com"
                    className="w-full rounded-lg border border-blue-100 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                  {memberErrors.email && (
                    <p className="mt-1 text-[10px] text-red-400">{memberErrors.email.message}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={addingMember}
                  className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50"
                >
                  {addingMember ? "Adding..." : "Add"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
