import api from './api';

export const userLogin = async (email,password)=>{
    return await (api.post('/auth/login',{email,password}));
}

export const userRegister = async (name,email,password)=>{
    return await (api.post('/auth/register',{name,email,password}));
}

export const verifyOTP = async (email, otp)=>{
    return await (api.post('/auth/verify-email-otp',{email, otp}));
}

export const resendOTP = async (email)=>{
    return await (api.post('/auth/resend-otp',{email}));
}

export const forgotPassword = async (email)=>{
    return await (api.post('/auth/forgot-password',{email}));
}

export const resetPassword = async (email, otp, newPassword)=>{
    return await (api.post('/auth/reset-password',{email, otp, newPassword}));
}

export const getProfile=async ()=>{
    return await api.get("/auth/profile");
}