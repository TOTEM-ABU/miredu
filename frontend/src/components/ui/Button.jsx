import React from "react";
import { Loader2 } from "lucide-react";

export default function Button({
  children,
  onClick,
  loading,
  type = "button",
  variant = "primary",
  className = "",
  ...props
}) {
  const baseClass =
    variant === "primary"
      ? "btn-primary"
      : variant === "outline"
        ? "btn-outline"
        : "btn-ghost";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || props.disabled}
      className={`${baseClass} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
      ) : (
        children
      )}
    </button>
  );
}
