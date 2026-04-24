"use client";

import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: React.ReactNode;
  pendingChildren?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

export function SubmitButton({
  children,
  pendingChildren,
  className = "btn btn-primary",
  disabled,
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className={className} disabled={pending || disabled}>
      {pending ? (
        <>
          <span className="loading loading-spinner loading-xs" />
          {pendingChildren ?? children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
