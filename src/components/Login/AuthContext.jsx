// src/context/AuthContext.js
import React, {createContext, useContext, useEffect, useState} from 'react';

// AuthContext 생성
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState("eyJhbGciOiJIUzUxMiJ9.eyJyb2xlcyI6Ik5vcm1hbCIsInN1YiI6IjExMDQ2NDc1NjAzODIwOTE2OTY4NCIsImlhdCI6MTczMDM2NDUzOCwiZXhwIjoxNzMwNDAwNTM4fQ.uJgpRjkCybbvtSVv7tKQMRNkHCMoxgndGQzliFMx5XMBKyWwevM07rI8p8ipUEEsE4jKeq-iCLV_SiyFC0CW6Q"); // 임의의 발급받은 JWT 토큰
    const fetchJwtToken = async () => {
        try {
            const response = await fetch('http://localhost:8080/token', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Received data:', data); // 응답 데이터 확인
                setToken(data.token); // 받은 토큰을 상태에 저장
            } else {
                const errorText = await response.text(); // 오류 메시지 확인
                console.error('Error fetching token:', response.status, errorText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    fetchJwtToken();

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
