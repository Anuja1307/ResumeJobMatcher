const crypto = require("crypto");
const { redisClient } = require("../config/redis");

function generateOTP() {
    return crypto.randomInt(100000, 1000000).toString();
}

function hashOTP(otp) {
    return crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");
}

async function storeOTP(email, otp) {
    const hashedOTP = hashOTP(otp);

    const key = `otp:${email.toLowerCase()}`;

    await redisClient.set(
        key,
        hashedOTP,
        {
            EX: 300
        }
    );
}

async function verifyOTP(email, otp) {
    const normalizedEmail = email.toLowerCase();

    const otpKey = `otp:${normalizedEmail}`;
    const attemptsKey = `otp-attempts:${normalizedEmail}`;

    const storedHash = await redisClient.get(otpKey);

    if (!storedHash) {
        return {
            success: false,
            message: "OTP expired or not found"
        };
    }

    const attempts =
        Number(await redisClient.get(attemptsKey)) || 0;

    if (attempts >= 5) {
        await redisClient.del(otpKey);
        await redisClient.del(attemptsKey);

        return {
            success: false,
            message: "Too many incorrect attempts"
        };
    }

    const submittedHash = hashOTP(otp);

    if (submittedHash !== storedHash) {
        const newAttempts =
            await redisClient.incr(attemptsKey);

        if (newAttempts === 1) {
            await redisClient.expire(
                attemptsKey,
                300
            );
        }

        return {
            success: false,
            message: "Invalid OTP"
        };
    }

    // OTP is correct
    await redisClient.del(otpKey);
    await redisClient.del(attemptsKey);

    return {
        success: true,
        message: "OTP verified successfully"
    };
}

async function canResendOTP(email) {
    const normalizedEmail = email.toLowerCase();

    const key = `otp-resend:${normalizedEmail}`;

    const exists = await redisClient.exists(key);

    if (exists) {
        const remainingSeconds =
            await redisClient.ttl(key);

        return {
            allowed: false,
            remainingSeconds
        };
    }

    await redisClient.set(
        key,
        "1",
        {
            EX: 60
        }
    );

    return {
        allowed: true,
        remainingSeconds: 0
    };
}

async function checkOTPRequestLimit(email, limit = 5, windowSeconds = 60) {
    const normalizedEmail = email.toLowerCase();

    const key = `otp-request-limit:${normalizedEmail}`;

    const count = await redisClient.incr(key);

    if (count === 1) {
        await redisClient.expire(key, windowSeconds);
    }

    return count <= limit;
}
async function storePasswordResetOTP(email, otp) {
    const hashedOTP = hashOTP(otp);

    const key = `password-reset-otp:${email.toLowerCase()}`;

    await redisClient.set(key, hashedOTP, {
        EX: 300
    });
}

async function verifyPasswordResetOTP(email, otp) {
    const key = `password-reset-otp:${email.toLowerCase()}`;

    const storedHash = await redisClient.get(key);

    if (!storedHash) {
        return {
            success: false,
            message: "OTP expired or not found"
        };
    }

    const submittedHash = hashOTP(otp);

    if (submittedHash !== storedHash) {
        return {
            success: false,
            message: "Invalid OTP"
        };
    }

    // Delete immediately after successful verification
    await redisClient.del(key);

    return {
        success: true,
        message: "OTP verified successfully"
    };
}
module.exports = {
    generateOTP,
    storeOTP,
    verifyOTP,
    canResendOTP,
    checkOTPRequestLimit,
    storePasswordResetOTP,
    verifyPasswordResetOTP
};