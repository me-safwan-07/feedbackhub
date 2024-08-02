import {resend} from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifycode: string,

): Promise<ApiResponse>{
    try {
       await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'feebackhub verification code',
        react: VerificationEmail({ username, otp: verifycode}),
        });
        return { success: true, message: "Verification email send successfully"};
    } catch (emailError) {
        console.error("Error sending verification email", emailError);
        return {
            success: false,
            message: "Failed to send verification email",
        }
    }
}
