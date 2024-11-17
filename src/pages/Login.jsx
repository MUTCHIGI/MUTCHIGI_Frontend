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