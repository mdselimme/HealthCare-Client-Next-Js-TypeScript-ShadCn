"use server";

import { deleteCookie } from "@/lib/tokenHandlers";
import { redirect } from "next/navigation";

// AUTH LOGOUT ACTION
export const authLogOut = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to log out");
  }
  const data = await res.json();
  if (data.success) {
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");
    redirect("/login");
  }
};
