import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { LoginCredentials } from "@/types";

export async function POST(req: Request) {
    try {
        // Add artificial delay to simulate network (optional, but requested in mock before)
        // await new Promise((resolve) => setTimeout(resolve, 500)); 

        const { email, password }: LoginCredentials = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: "Missing email or password" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json(
                { success: false, error: "Invalid email or password" },
                { status: 401 }
            );
        }

        if (!user.password) {
            // Handle cases where user might be created without password (social login case?)
            // For now, fail.
            return NextResponse.json(
                { success: false, error: "Invalid email or password" },
                { status: 401 }
            );
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json(
                { success: false, error: "Invalid email or password" },
                { status: 401 }
            );
        }

        // Prepare response data
        const userResponse = user.toObject();
        delete userResponse.password;

        const token = {
            accessToken: `db_access_${user._id}`,
            refreshToken: `db_refresh_${user._id}`,
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        };

        return NextResponse.json({
            success: true,
            data: {
                user: { ...userResponse, id: user._id.toString() },
                token,
                financialInput: user.financialInput || {},
                fireTarget: user.fireTarget || {},
            },
            message: "Login successful",
        });
    } catch (error: any) {
        console.error("Login Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
