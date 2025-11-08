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
  console.log(res)
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
