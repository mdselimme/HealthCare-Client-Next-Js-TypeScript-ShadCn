/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { IRegister } from "@/types/auth.types";
import { authLogIn } from "./login.action";

export const registerPatient = async (patient: IRegister) => {
  try {
    const patientData = {
      password: patient.password,
      patient: {
        name: patient.name,
        email: patient.email,
        address: patient.address,
      },
    };

    const patientFormData = new FormData();

    patientFormData.append("data", JSON.stringify(patientData));

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user/create-patient`,
      {
        method: "POST",
        body: patientFormData,
      }
    );

    const data = await res.json();

    if (data.success) {
      await authLogIn({ email: patient.email, password: patient.password });
    }

    return data;
  } catch (error: any) {
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    throw error;
  }
};
