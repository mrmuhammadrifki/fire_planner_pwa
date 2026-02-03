import mongoose, { Schema, Model, Document } from "mongoose";

export type TransactionType = "income" | "outcome";

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    type: TransactionType;
    amount: number;
    category: string;
    date: Date;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        type: { type: String, enum: ["income", "outcome"], required: true },
        amount: { type: Number, required: true },
        category: { type: String, required: true },
        date: { type: Date, required: true, default: Date.now },
        description: { type: String },
    },
    { timestamps: true }
);

const Transaction: Model<ITransaction> =
    mongoose.models.Transaction || mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default Transaction;
