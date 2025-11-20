import Logo from '../img/mutchigi_logo.png';
import { useContext, useEffect, } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../components/Login/AuthContext.jsx";
import styles from "./CSS/Login.module.css"
import button from "../img/google_login.svg"

function Login() {
    const { token, setToken } = useAuth();

    const handleLogin = () => {
        window.location.href = `${import.meta.env.VITE_SERVER_IP}/oauth2/authorization/google`;
    };
    const navigator = useNavigate();

    useEffect(() => {
        // 1. 현재 URL의 쿼리 파라미터 확인
        const urlParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = urlParams.get('token');

        // 2. URL에 토큰이 '없는' 경우에만 (즉, 구글 로그인 리다이렉트가 아닌 경우)
        // 기존에 저장된 토큰을 날려버림
        if (!tokenFromUrl) {
            // console.log("일반 접속이므로 토큰을 초기화합니다.");
            setToken(null);
            localStorage.removeItem('jwtToken');
        }
        // 만약 tokenFromUrl이 있다면, AuthContext에서 이미 처리를 하거나 유지하므로 둡니다.
    }, [setToken]);

    useEffect(() => {
        if (token !== null) {
            navigator('/home');
        }
    }, [token]);

    return (
        <div className={styles['login-container']}>
            <div className={styles["login-left"]}>
                <img
                    className={styles["logo"]}
                    src={Logo}
                />
                <span className={styles['main-text']}>
                    음악을 퀴즈로 만들고<br />
                    사람들과 풀어보기
                </span>
            </div>
            <div className={styles["login-div"]}>
                <span className={styles['login-text']}>
                    Login
                </span>
                <div className={styles['login-round']}>
                    <button className={styles["login"]} onClick={handleLogin}>
                        <img src={button} alt="Google Logo" className={styles["button-image"]} />
                        Sign with Google
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Login;
