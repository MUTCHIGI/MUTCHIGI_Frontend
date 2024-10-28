// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

// AuthContext 생성
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState("eyJhbGciOiJIUzUxMiJ9.eyJyb2xlcyI6Ik5vcm1hbCIsInN1YiI6IjExMDQ2NDc1NjAzODIwOTE2OTY4NCIsImlhdCI6MTczMDEzNjM1NSwiZXhwIjoxNzMwMTcyMzU1fQ.CYHq5Q6p9qneYGDdGF7tmF79vJJXnACYxjvu2wwdLKSBPoZaPEqU2259XMulIMh3NOFfbNeY4p-dLlFehaYP0w"); // 임의의 발급받은 JWT 토큰

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

// useAuth 훅 생성
export const useAuth = () => {
    return useContext(AuthContext);
};
