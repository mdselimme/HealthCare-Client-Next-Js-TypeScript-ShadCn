"use server"

import { IRegister } from "@/types/auth.types"

export const registerPatient = async (patient: IRegister) => {

    const patientData = {
        password: patient.password,
        patient: {
            name: patient.name,
            email: patient.email,
            address: patient.address
        }
    };

    const patientFormData = new FormData();

    patientFormData.append("data", JSON.stringify(patientData));

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/create-patient`, {
        method: "POST",
        body: patientFormData,
    });


    if (!res.ok) {
        throw new Error("Failed to Register Account");
    }
    const data = await res.json();
    return data;
}