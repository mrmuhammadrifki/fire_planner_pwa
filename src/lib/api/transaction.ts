import { ApiResponse, Transaction, CreateTransactionData, TransactionType } from "@/types";
import { apiFetch } from "./client";

export async function fetchTransactions(
    token: string,
    type?: TransactionType
): Promise<ApiResponse<Transaction[]>> {
    let url = "/transactions";
    if (type) {
        url += `?type=${type}`;
    }

    return apiFetch<Transaction[]>(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
    });
}

export async function addTransaction(
    token: string,
    data: CreateTransactionData
): Promise<ApiResponse<Transaction>> {
    return apiFetch<Transaction>("/transactions", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data)
    });
}

export async function deleteTransaction(
    token: string,
    id: string
): Promise<ApiResponse<void>> {
    return apiFetch<void>(`/transactions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
    });
}
