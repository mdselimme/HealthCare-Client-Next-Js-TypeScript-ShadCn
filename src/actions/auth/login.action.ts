/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { ILogIn } from "@/types/auth.types";
import { parse } from "cookie";
import { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { getDefaultDashboardRoute, isValidRedirectForRole, IUserRole } from "@/lib/auth.utils";
import { redirect } from "next/navigation";

// AUTH LOGIN ACTION
export const authLogIn = async (loginData: ILogIn & { redirect: string }) => {
  try {
    let accessTokenObject: null | any = null;
    let refreshTokenObject: null | any = null;
    const redirectTo = loginData.redirect || null;

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
    const verifiedToken: JwtPayload | string = jwt.verify(accessTokenObject.accessToken, process.env.JWT_SECRET as string);

    if (typeof verifiedToken === "string") {
      throw new Error("Invalid token");

    }

    const userRole: IUserRole = verifiedToken.role;


    if (redirectTo) {
      const requestedPath = redirectTo.toString();
      if (isValidRedirectForRole(requestedPath, userRole)) {
        redirect(requestedPath);
      } else {
        redirect(getDefaultDashboardRoute(userRole));
      }
    }
    const data = await res.json();

    return data;
  } catch (error: any) {
    if (error?.digest?.startsWith('NEXT_REDIRECT')) {
      throw error;
    }
    console.log(error);
    return { error: "Login failed" };
  }
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
