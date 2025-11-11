"use server";

import { deleteCookie } from "@/lib/tokenHandlers";

// AUTH LOGOUT ACTION
export const authLogOut = async () => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });
  const data = await res.json();
  if (data.success) {
    await deleteCookie("accessToken");
    await deleteCookie("refreshToken");

    return {
      success: true,
      message: "Log Out User Successfully.",
    };
  }
};
