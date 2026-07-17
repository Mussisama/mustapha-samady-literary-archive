"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();
    setBusy(false);
    if (!response.ok) return setError(data.error || "ورود ناموفق بود.");
    router.push("/admin");
    router.refresh();
  }

  return (
    <form className="admin-login-form" onSubmit={submit}>
      <label htmlFor="password">رمز عبور</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        autoFocus
        required
      />
      {error && <p className="admin-error">{error}</p>}
      <button type="submit" disabled={busy}>
        {busy ? "در حال ورود..." : "ورود"}
      </button>
    </form>
  );
}
