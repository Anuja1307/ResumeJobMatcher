import {createContext,useContext,useState,useEffect} from "react";

const AuthContext=createContext();

export const AuthProvider=({children})=>{
    const [user,SetUser]=useState(null);
    const [token,SetToken]=useState(null);
    const [loading,SetLoading]=useState(true);

    useEffectt(()=>{
        const savedUser=localStorage.getItem('user');
        const savedToken=localStorage.getItem('token');
        if(savedUser && savedToken){
            SetUser(JSON.parse(savedUser));
            SetToken(savedToken);
        }
        SetLoading(false);

    })

    const login=(user,token)=>{
        setUser(user);
        setToken(token);
        localStorage.setItem('user',JSON.stringify(user));
        localStorage.setItem('token',token);
    }
    const logout=()=>{
        setUser(null);
        setToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    return (<AuthContext.Provider value={{user,token,loading,login,logout}}>
        {children}
        </AuthContext.Provider>);
};


export const useAuth=()=>useContext(AuthContext);