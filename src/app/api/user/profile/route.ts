import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

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

        await connectToDatabase();
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: user
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

        const { name, settings, email } = await req.json();

        await connectToDatabase();

        // Prevent email duplicates if changing email
        if (email) {
            const existing = await User.findOne({ email: email.toLowerCase(), _id: { $ne: userId } });
            if (existing) {
                return NextResponse.json({ success: false, error: "Email already taken" }, { status: 409 });
            }
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (settings) updateData.settings = settings;
        if (email) updateData.email = email.toLowerCase();

        const user = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select("-password");

        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: user,
            message: "Profile updated successfully"
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
