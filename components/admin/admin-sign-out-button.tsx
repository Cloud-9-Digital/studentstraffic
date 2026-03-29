"use client";

import { startTransition, useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export function AdminSignOutButton({ iconOnly = false }: { iconOnly?: boolean }) {
  const [pending, setPending] = useState(false);

  function handleSignOut() {
    setPending(true);
    startTransition(() => {
      void signOut({ callbackUrl: "/login" });
    });
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {iconOnly ? (
          <button
            disabled={pending}
            className="flex size-8 items-center justify-center rounded-lg text-red-400 transition-colors hover:bg-red-400/15 hover:text-red-300 disabled:opacity-50"
            aria-label="Sign out"
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
          </button>
        ) : (
          <Button
            variant="outline"
            className="w-full justify-start gap-3 rounded-xl border-red-400/30 bg-transparent px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-400/10 hover:text-red-300"
            disabled={pending}
          >
            {pending ? <Loader2 className="size-4 animate-spin" /> : <LogOut className="size-4" />}
            Sign out
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign out?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be returned to the login page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleSignOut}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Sign out
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
