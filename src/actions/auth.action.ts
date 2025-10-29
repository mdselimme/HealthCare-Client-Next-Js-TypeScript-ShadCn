"use server";
// AUTH LOGIN ACTION
export const authLogIn = async (loginData: {
  email: string;
  password: string;
}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
    credentials: "include",
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

// AUTH REGISTER ACTION
export const authRegister = async (registerData: {
  name: string;
  email: string;
  password: string;
}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(registerData),
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to register");
  }
  const data = await res.json();
  return data;
};
