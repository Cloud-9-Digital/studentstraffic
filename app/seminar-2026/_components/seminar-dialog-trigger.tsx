"use client";

import { useSeminarDialog } from "./seminar-dialog-context";

type Props = {
  children: React.ReactNode;
  className?: string;
  preselectedEvent?: string;
};

export function SeminarDialogTrigger({ children, className, preselectedEvent }: Props) {
  const { open } = useSeminarDialog();
  return (
    <button type="button" onClick={() => open(preselectedEvent)} className={className}>
      {children}
    </button>
  );
}
