/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { ILogIn } from "@/types/auth.types";
import { parse } from "cookie";
import { cookies } from "next/headers";

// AUTH LOGIN ACTION
export const authLogIn = async (loginData: ILogIn) => {
  let accessTokenObject: null | any = null;
  let refreshTokenObject: null | any = null;


  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
    credentials: "include",
  });
  const setCookieHeaders = res.headers.getSetCookie();

  if (setCookieHeaders && setCookieHeaders.length > 0) {
    setCookieHeaders.forEach((cookie: string) => {
      const parsedCookie = parse(cookie);

      if (parsedCookie['accessToken']) {
        accessTokenObject = parsedCookie;
      }
      if (parsedCookie['refreshToken']) {
        refreshTokenObject = parsedCookie;
      }
    })
  } else {
    throw new Error("No Set-Cookie header found");
  }

  if (!accessTokenObject) {
    throw new Error("Tokens not found in cookies");
  }

  if (!refreshTokenObject) {
    throw new Error("Tokens not found in cookies");
  }

  const cookieStore = await cookies();

  cookieStore.set("accessToken", accessTokenObject.accessToken, {
    secure: true,
    httpOnly: true,
    maxAge: parseInt(accessTokenObject['Max-Age']) || 1000 * 60 * 60,
    path: accessTokenObject.Path || "/",
    sameSite: accessTokenObject['SameSite'] || "none",
  });

  cookieStore.set("refreshToken", refreshTokenObject.refreshToken, {
    secure: true,
    httpOnly: true,
    maxAge: parseInt(refreshTokenObject['Max-Age']) || 1000 * 60 * 60 * 24 * 90,
    path: refreshTokenObject.Path || "/",
    sameSite: refreshTokenObject['SameSite'] || "none",
  });
  if (!res.ok) {
    throw new Error("Failed to log in");
  }
  const data = await res.json();
  return data;
};

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
  return data;
};
