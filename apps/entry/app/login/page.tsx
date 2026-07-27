"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-sky-100 px-4">
      <div className="card w-full max-w-sm p-8">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-9 h-9 rounded bg-brand text-white flex items-center justify-center font-bold">P</div>
          <div>
            <div className="font-bold text-lg leading-none">PIMS</div>
            <div className="text-xs text-slate-500">Pipeline Integrity Management System</div>
          </div>
        </div>
        <div className="text-sm text-slate-500 mb-6">Data Entry</div>

        <form action={formAction} className="space-y-4">
          <div>
            <label className="field-label" htmlFor="username">
              Username
            </label>
            <input id="username" name="username" className="field-input" autoComplete="username" required />
          </div>
          <div>
            <label className="field-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className="field-input"
              autoComplete="current-password"
              required
            />
          </div>

          {state.error && <p className="text-sm text-red-600">{state.error}</p>}

          <button type="submit" disabled={pending} className="btn-primary w-full justify-center">
            {pending ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
