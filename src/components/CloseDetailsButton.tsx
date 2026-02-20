"use client";

export default function CloseDetailsButton() {
  return (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={(e) => {
        (e.currentTarget.closest("details") as HTMLDetailsElement)?.removeAttribute("open");
      }}
    >
      Cancel
    </button>
  );
}
