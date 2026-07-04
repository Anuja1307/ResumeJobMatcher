import {createContext,useContext,useState,useEffect} from "react";

const AuthContext=createContext();

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null);
    const [token,setToken]=useState(null);
    const [loading,setLoading]=useState(true);

    useEffect(()=>{
        const savedUser=localStorage.getItem('user');
        const savedToken=localStorage.getItem('token');
        if(savedUser && savedToken){
            SetUser(JSON.parse(savedUser));
            SetToken(savedToken);
        }
        setLoading(false);

    },[]);

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