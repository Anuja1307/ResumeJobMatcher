import api from './api';

export const userLogin = async (email,password)=>{
    return await (api.post('/auth/login',{email,password}));
}

export const userRegister = async (name,email,password)=>{
    return await (api.post('/auth/register',{name,email,password}));
}

export const getProfile=async ()=>{
    return await api.get("/auth/profile");
}