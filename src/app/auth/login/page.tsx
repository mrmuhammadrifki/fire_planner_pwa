import { AuthLayout } from "@/components/layout";
import { LoginForm } from "@/components/auth";

export const metadata = {
    title: "Sign In - FIRE Planner",
    description: "Sign in to your FIRE Planner account",
};

export default function LoginPage() {
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
}
