// src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        return localStorage.getItem('jwtToken') || null;
    });

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token'); // 'token'을 추출

        // URL에서 토큰이 있는 경우
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            localStorage.setItem('jwtToken', tokenFromUrl);
        }
    }, [window.location.search]);

    return (
        <AuthContext.Provider value={{ token, setToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
