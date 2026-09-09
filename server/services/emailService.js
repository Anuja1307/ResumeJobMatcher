const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendOTPEmail(email, otp) {
    // Always log OTP for testing purposes
    console.log("========================================");
    console.log("DEV MODE: OTP logged to console");
    console.log("Email:", email);
    console.log("OTP:", otp);
    console.log("========================================");

    try {
        const { data, error } = await resend.emails.send({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "Verify your Resume Matcher account",
            html: `
                <div>
                    <h2>Email Verification</h2>

                    <p>Your verification code is:</p>

                    <h1>${otp}</h1>

                    <p>This OTP will expire in 5 minutes.</p>

                    <p>If you did not create this account, you can ignore this email.</p>
                </div>
            `
        });

        if (error) {
            throw new Error(error.message);
        }

        console.log("OTP email sent:", data.id);

        return data;
    } catch (error) {
        console.error("Email sending error:", error);
        // For testing purposes, don't throw error - allow registration to proceed
        // In production, you would want to throw this error
        return { id: "dev-mode", devMode: true };
    }
}

module.exports = {
    sendOTPEmail
};