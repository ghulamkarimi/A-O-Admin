
import { useState } from "react";
import EmailForm from "../components/auth/Email";
import VerificationCode from "../components/auth/VerificationCode";
import ChangePassword from "../components/auth/ChangePassword";

const PasswordResetPage = () => {
    const [step, setStep] = useState(1); // 1: E-Mail, 2: Verifizierung, 3: Passwort ändern
    const [email, setEmail] = useState("");

    return (
        <div className="min-h-screen flex flex-col items-center justify-center background "
        style={{ backgroundImage: "url('/homeBackground.jpg')" }}
        >
            <div className="bg-black/70 p-6 rounded-lg shadow-lg">
                <div className="flex flex-col items-center mb-6">
                    <img src="/logo.png" alt="Logo" className="w-24 h-24 mb-4 rounded-full" />
                    <h1 className="text-3xl font-bold text-center text-white">Passwort zurücksetzen</h1>
                </div>
                <div className="max-w-md w-full text-white ">
                    {step === 1 && <EmailForm onNextStep={() => setStep(2)} setEmail={setEmail} />}
                    {step === 2 && <VerificationCode onNextStep={() => setStep(3)} email={email} />}
                    {step === 3 && <ChangePassword email={email} />}
                </div>
            </div>
        </div>
    );
};

export default PasswordResetPage;
