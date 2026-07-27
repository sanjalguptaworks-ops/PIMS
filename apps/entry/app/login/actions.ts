"use server";

import { redirect } from "next/navigation";
import { prisma } from "@pims/db";
import { verifyPassword } from "@pims/auth/password";
import { canAccessApp } from "@pims/auth";
import { createSession } from "@/lib/session";

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Enter username and password." };
  }

  const user = await prisma.user.findUnique({ where: { username } });
  if (!user || !user.active) {
    return { error: "Invalid username or password." };
  }

  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) {
    return { error: "Invalid username or password." };
  }

  if (!canAccessApp(user.role, "entry")) {
    return { error: "This account does not have access to the Data Entry site." };
  }

  await createSession({
    userId: user.id,
    username: user.username,
    name: user.name,
    role: user.role,
    companyId: user.companyId,
  });

  redirect("/");
}
