const crypto = require("crypto");
const { redisClient } = require("../config/redis");

const fallbackStore = new Map();

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

    try {
        if (redisClient.isOpen) {
            await redisClient.set(key, hashedOTP, { EX: 300 });
            return;
        }
    } catch (err) {
        console.warn("Redis storeOTP error, using fallback:", err.message);
    }
    fallbackStore.set(key, { value: hashedOTP, expiresAt: Date.now() + 300000 });
}

async function verifyOTP(email, otp) {
    const normalizedEmail = email.toLowerCase();
    const otpKey = `otp:${normalizedEmail}`;
    const attemptsKey = `otp-attempts:${normalizedEmail}`;

    let storedHash = null;

    try {
        if (redisClient.isOpen) {
            storedHash = await redisClient.get(otpKey);
        }
    } catch (err) {
        console.warn("Redis verifyOTP get error, using fallback:", err.message);
    }

    if (!storedHash && fallbackStore.has(otpKey)) {
        const item = fallbackStore.get(otpKey);
        if (item.expiresAt > Date.now()) {
            storedHash = item.value;
        } else {
            fallbackStore.delete(otpKey);
        }
    }

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

    try {
        if (redisClient.isOpen) {
            await redisClient.del(otpKey);
            await redisClient.del(attemptsKey);
        }
    } catch (err) {
        console.warn("Redis del error:", err.message);
    }
    fallbackStore.delete(otpKey);

    return {
        success: true,
        message: "OTP verified successfully"
    };
}

async function canResendOTP(email) {
    const normalizedEmail = email.toLowerCase();
    const key = `otp-resend:${normalizedEmail}`;

    try {
        if (redisClient.isOpen) {
            const exists = await redisClient.exists(key);
            if (exists) {
                const remainingSeconds = await redisClient.ttl(key);
                return { allowed: false, remainingSeconds };
            }
            await redisClient.set(key, "1", { EX: 60 });
            return { allowed: true, remainingSeconds: 0 };
        }
    } catch (err) {
        console.warn("Redis canResendOTP error, allowing:", err.message);
    }

    return { allowed: true, remainingSeconds: 0 };
}

async function checkOTPRequestLimit(email, limit = 5, windowSeconds = 60) {
    const normalizedEmail = email.toLowerCase();
    const key = `otp-request-limit:${normalizedEmail}`;

    try {
        if (redisClient.isOpen) {
            const count = await redisClient.incr(key);
            if (count === 1) {
                await redisClient.expire(key, windowSeconds);
            }
            return count <= limit;
        }
    } catch (err) {
        console.warn("Redis request limit error, allowing:", err.message);
    }

    return true;
}

async function storePasswordResetOTP(email, otp) {
    const hashedOTP = hashOTP(otp);
    const key = `password-reset-otp:${email.toLowerCase()}`;

    try {
        if (redisClient.isOpen) {
            await redisClient.set(key, hashedOTP, { EX: 300 });
            return;
        }
    } catch (err) {
        console.warn("Redis storePasswordResetOTP error, using fallback:", err.message);
    }
    fallbackStore.set(key, { value: hashedOTP, expiresAt: Date.now() + 300000 });
}

async function verifyPasswordResetOTP(email, otp) {
    const key = `password-reset-otp:${email.toLowerCase()}`;
    let storedHash = null;

    try {
        if (redisClient.isOpen) {
            storedHash = await redisClient.get(key);
        }
    } catch (err) {
        console.warn("Redis verifyPasswordResetOTP error:", err.message);
    }

    if (!storedHash && fallbackStore.has(key)) {
        const item = fallbackStore.get(key);
        if (item.expiresAt > Date.now()) {
            storedHash = item.value;
        } else {
            fallbackStore.delete(key);
        }
    }

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

    try {
        if (redisClient.isOpen) {
            await redisClient.del(key);
        }
    } catch (err) {
        console.warn("Redis del error:", err.message);
    }
    fallbackStore.delete(key);

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