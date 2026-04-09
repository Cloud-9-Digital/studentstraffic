"use client";

import { useLpDialog } from "./lp-dialog";

type Props = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export function LpDialogTrigger({ children, className, style }: Props) {
  const { open } = useLpDialog();
  return (
    <button type="button" onClick={open} className={className} style={style}>
      {children}
    </button>
  );
}
