"use client";
import { authLogOut } from "@/actions/auth/logOutUser";
import { Button } from "@/components/ui/button";

const LogOutButton = () => {
  const logOutBtn = async () => {
    await authLogOut();
  };
  return (
    <div>
      <Button onClick={logOutBtn}>Log Out</Button>
    </div>
  );
};

export default LogOutButton;
