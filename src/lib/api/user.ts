import { FinancialInput, FireTarget, UserProfile, ApiResponse, AppSettings } from "@/types";
import { apiFetch } from "./client";

export async function fetchUserData(token: string): Promise<ApiResponse<{
    financialInput: FinancialInput;
    fireTarget: FireTarget;
}>> {
    return apiFetch("/financial-data", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });
}

export async function updateFinancialData(
    token: string,
    data: { financialInput?: Partial<FinancialInput>, fireTarget?: Partial<FireTarget> }
): Promise<ApiResponse<{
    financialInput: FinancialInput;
    fireTarget: FireTarget;
}>> {
    return apiFetch("/financial-data", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
    });
}

export async function updateUserProfile(
    token: string,
    data: { name?: string; settings?: Partial<AppSettings>; email?: string }
): Promise<ApiResponse<UserProfile>> {
    return apiFetch("/user/profile", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
    });
}
