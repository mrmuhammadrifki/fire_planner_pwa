import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { RegisterData } from "@/types";

export async function POST(req: Request) {
    try {
        const { email, password, name }: RegisterData = await req.json();

        if (!email || !password || !name) {
            return NextResponse.json(
                { success: false, error: "Missing required fields" },
                { status: 400 }
            );
        }

        await connectToDatabase();

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: "Email already registered" },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email: email.toLowerCase(),
            password: hashedPassword,
            name,
        });

        // Strip password from response
        const userResponse = newUser.toObject();
        delete userResponse.password;

        // Generate mock token (replace with JWT in production if needed)
        const token = {
            accessToken: `db_access_${newUser._id}`,
            refreshToken: `db_refresh_${newUser._id}`,
            expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        };

        return NextResponse.json({
            success: true,
            data: {
                user: { ...userResponse, id: newUser._id.toString() },
                token,
            },
            message: "Account created successfully",
        });
    } catch (error: any) {
        console.error("Register Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
