"use client";

import { useActionState } from "react";
import { RefreshCw, RotateCcw } from "lucide-react";

import {
  processLeadDeliveryQueueAction,
  retryFailedLeadDeliveryJobsAction,
  retryLeadDeliveryJobAction,
  type LeadDeliveryActionState,
} from "@/app/_actions/manage-lead-delivery";
import { Button } from "@/components/ui/button";

const initialState: LeadDeliveryActionState = {
  status: "idle",
};

function ActionMessage({ state }: { state: LeadDeliveryActionState }) {
  if (state.status === "idle" || !state.message) {
    return null;
  }

  return (
    <p
      className={
        state.status === "success"
          ? "rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700"
          : "rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
      }
    >
      {state.message}
    </p>
  );
}

export function LeadDeliveryQueueActions() {
  const [processState, processAction, isProcessing] = useActionState(
    processLeadDeliveryQueueAction,
    initialState,
  );
  const [retryFailedState, retryFailedAction, isRetryingFailed] =
    useActionState(retryFailedLeadDeliveryJobsAction, initialState);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <form action={processAction}>
          <Button type="submit" disabled={isProcessing}>
            <RefreshCw className="size-4" />
            {isProcessing ? "Processing..." : "Process pending"}
          </Button>
        </form>
        <form action={retryFailedAction}>
          <Button
            type="submit"
            variant="outline"
            disabled={isRetryingFailed}
          >
            <RotateCcw className="size-4" />
            {isRetryingFailed ? "Queueing..." : "Retry failed"}
          </Button>
        </form>
      </div>
      <ActionMessage state={processState} />
      <ActionMessage state={retryFailedState} />
    </div>
  );
}

export function RetryLeadDeliveryJobButton({
  jobId,
  disabled,
}: {
  jobId: number;
  disabled?: boolean;
}) {
  const [state, action, pending] = useActionState(
    retryLeadDeliveryJobAction,
    initialState,
  );

  return (
    <div className="space-y-2">
      <form action={action}>
        <input type="hidden" name="jobId" value={jobId} />
        <Button
          type="submit"
          size="xs"
          variant="outline"
          disabled={disabled || pending}
        >
          <RotateCcw className="size-3" />
          {pending ? "Queueing..." : "Retry"}
        </Button>
      </form>
      <ActionMessage state={state} />
    </div>
  );
}
