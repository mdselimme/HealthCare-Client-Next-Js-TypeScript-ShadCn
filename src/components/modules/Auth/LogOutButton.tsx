/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { authLogOut } from "@/actions/auth/logOutUser";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const LogOutButton = () => {
  const router = useRouter();
  const logOutBtn = async () => {
    try {
      const result = await authLogOut();
      if (result?.success) {
        toast.success(result?.message ?? "User Logged Out Successfully");
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to log out");
    }
  };
  return (
    <div>
      <Button onClick={logOutBtn}>Log Out</Button>
    </div>
  );
};

export default LogOutButton;
