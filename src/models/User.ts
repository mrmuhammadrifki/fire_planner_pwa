import mongoose, { Schema, Model, Document } from "mongoose";
import { FinancialInput, FireTarget, AppSettings } from "@/types";

export interface IUser extends Document {
    email: string;
    name: string;
    password?: string; // Hashed
    financialInput: FinancialInput;
    fireTarget: FireTarget;
    settings: AppSettings;
    createdAt: Date;
    updatedAt: Date;
}

const FinancialInputSchema = new Schema<FinancialInput>({
    monthlyIncome: { type: Number, default: 0 },
    monthlyExpenses: { type: Number, default: 0 },
    initialSavings: { type: Number, default: 0 },
    savingRate: { type: Number, default: 0 },
    currency: { type: String, default: "IDR" },
});

const FireTargetSchema = new Schema<FireTarget>({
    targetAge: { type: Number, default: 55 },
    currentAge: { type: Number, default: 25 },
    targetPortfolio: { type: Number, default: 0 },
    annualReturn: { type: Number, default: 7 },
    safeWithdrawalRate: { type: Number, default: 4 },
    inflationRate: { type: Number, default: 3 },
});

const AppSettingsSchema = new Schema<AppSettings>({
    theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
    currency: { type: String, default: "IDR" },
    locale: { type: String, default: "id-ID" },
    language: { type: String, enum: ["en", "id"], default: "id" },
});

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        password: { type: String, required: true },
        financialInput: { type: FinancialInputSchema, default: {} },
        fireTarget: { type: FireTargetSchema, default: {} },
        settings: { type: AppSettingsSchema, default: {} },
    },
    { timestamps: true }
);

const User: Model<IUser> =
    mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
