import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

// Helper to extract User ID from mock token
const getUserIdFromToken = (req: Request) => {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

    const token = authHeader.split(" ")[1];
    // Token format: db_access_{userId}
    if (!token.startsWith("db_access_")) return null;

    return token.replace("db_access_", "");
}

export async function GET(req: Request) {
    try {
        const userId = getUserIdFromToken(req);
        if (!userId) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: {
                financialInput: user.financialInput,
                fireTarget: user.fireTarget,
            }
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const userId = getUserIdFromToken(req);
        if (!userId) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { financialInput, fireTarget } = body;

        await connectToDatabase();

        const updateData: any = {};
        if (financialInput) updateData.financialInput = financialInput;
        if (fireTarget) updateData.fireTarget = fireTarget;

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: {
                financialInput: user.financialInput,
                fireTarget: user.fireTarget,
            },
            message: "Financial data updated successfully"
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
