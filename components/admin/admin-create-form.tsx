"use client";

import { useActionState, useEffect, useRef } from "react";
import { Loader2, UserPlus } from "lucide-react";

import { createAdminUserAction } from "@/app/_actions/admin-users";
import type { AdminCreateState } from "@/app/_actions/admin-users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialAdminCreateState: AdminCreateState = {
  status: "idle",
};

export function AdminCreateForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action, pending] = useActionState(
    createAdminUserAction,
    initialAdminCreateState
  );

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/8 text-primary">
          <UserPlus className="size-4" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Add user</h3>
      </div>
      <form ref={formRef} action={action} className="space-y-3.5">
        <div className="space-y-1.5">
          <Label htmlFor="admin-full-name" className="text-xs font-semibold uppercase tracking-wider text-slate-500">Full name</Label>
          <Input id="admin-full-name" name="fullName" placeholder="Aarav Sharma" required className="h-10 rounded-xl text-sm" />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="admin-user-email" className="text-xs font-semibold uppercase tracking-wider text-slate-500">Email</Label>
          <Input
            id="admin-user-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="h-10 rounded-xl text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="admin-user-role" className="text-xs font-semibold uppercase tracking-wider text-slate-500">Role</Label>
          <select
            id="admin-user-role"
            name="role"
            defaultValue="admin"
            className="h-10 w-full rounded-xl border border-input bg-transparent px-3 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/20"
          >
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
          </select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="admin-user-password" className="text-xs font-semibold uppercase tracking-wider text-slate-500">Password</Label>
          <Input
            id="admin-user-password"
            name="password"
            type="password"
            placeholder="10+ chars, upper/lowercase, number"
            required
            className="h-10 rounded-xl text-sm"
          />
          <p className="text-xs text-slate-400">
            Owners can manage admins and export leads. Create regular admins by default.
          </p>
        </div>

        {state.message ? (
          <div
            className={`rounded-xl px-4 py-3 text-sm ${
              state.status === "success"
                ? "border border-status-green-border bg-status-green text-status-green-fg"
                : state.status === "error"
                  ? "border border-destructive/20 bg-destructive/8 text-destructive"
                  : "border border-border bg-muted text-muted-foreground"
            }`}
          >
            {state.message}
          </div>
        ) : null}

        <Button type="submit" disabled={pending} className="mt-1 h-10 w-full rounded-xl bg-primary text-sm hover:bg-surface-dark-2">
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating…
            </>
          ) : (
            "Create user"
          )}
        </Button>
      </form>
    </div>
  );
}
