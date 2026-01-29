/*
  Decision log:
  - Error boundary at route-level helps us observe failures and retry.
  - Must be a Client Component to use the 'reset' function from Next.
*/
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <div className="alert alert-error glass">
      <span>{error.message || "Something went wrong."}</span>
      <button className="btn btn-sm ml-4" onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}