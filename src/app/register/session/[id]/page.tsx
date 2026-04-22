import RegisterForm from "./RegistrationForm";
import { RegistrationLayout } from "@/components/layout/RegistrationLayout";

export default async function RegisterPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const {id} = await params;
    console.log("seesion ID: ",id);
    return (
        <RegistrationLayout>
            <RegisterForm sessionId={id} />
        </RegistrationLayout>
    );
}