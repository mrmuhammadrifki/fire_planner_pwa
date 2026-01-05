import { AuthLayout } from "@/components/layout";
import { RegisterForm } from "@/components/auth";

export const metadata = {
    title: "Create Account - FIRE Planner",
    description: "Create your free FIRE Planner account and start your journey to financial independence",
};

export default function RegisterPage() {
    return (
        <AuthLayout>
            <RegisterForm />
        </AuthLayout>
    );
}
