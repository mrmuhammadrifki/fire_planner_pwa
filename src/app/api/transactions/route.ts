import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Transaction from "@/models/Transaction";
import mongoose from "mongoose";

const getUserIdFromToken = (req: Request) => {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

    const token = authHeader.split(" ")[1];
    if (!token.startsWith("db_access_")) return null;
    return token.replace("db_access_", "");
}

export async function GET(req: Request) {
    try {
        const userId = getUserIdFromToken(req);
        if (!userId) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type");

        await connectToDatabase();

        const query: any = { userId };
        if (type) {
            query.type = type;
        }

        const transactions = await Transaction.find(query).sort({ date: -1 });

        return NextResponse.json({
            success: true,
            data: transactions
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const userId = getUserIdFromToken(req);
        if (!userId) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { type, amount, category, date, description } = body;

        if (!type || !amount || !category || !date) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const newTransaction = await Transaction.create({
            userId,
            type,
            amount,
            category,
            date: new Date(date),
            description
        });

        return NextResponse.json({
            success: true,
            data: newTransaction,
            message: "Transaction added successfully"
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
