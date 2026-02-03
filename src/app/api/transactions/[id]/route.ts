import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Transaction from "@/models/Transaction";

const getUserIdFromToken = (req: Request) => {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

    const token = authHeader.split(" ")[1];
    if (!token.startsWith("db_access_")) return null;
    return token.replace("db_access_", "");
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const userId = getUserIdFromToken(req);
        if (!userId) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await connectToDatabase();

        const deletedTransaction = await Transaction.findOneAndDelete({
            _id: id,
            userId // Ensure user owns the transaction
        });

        if (!deletedTransaction) {
            return NextResponse.json(
                { success: false, error: "Transaction not found or unauthorized" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Transaction deleted successfully"
        });

    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
