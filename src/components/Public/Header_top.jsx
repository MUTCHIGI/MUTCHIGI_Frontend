import './CSS/Header_top.css';
import Button from "./Button.jsx";
import Logo from '../../img/mutchigi_logo.png';
import Profile from '../../img/프로필1.png';
import Triangle from '../../img/Polygon 1.png'
import {useContext, useEffect, useRef, useState} from "react";
import {WindowSizeContext} from "../../App.jsx";
import Profile_logout_floating from "./Profile_logout_floating.jsx";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../Login/AuthContext.jsx";

function Header_top({userInfo,setUserInfo,setFirstCreate, setRestartQuizId}) {
    const {token,setToken} = useAuth();

    const handleLogin = () => {
        navigator('/');
    };

    const navigator = useNavigate();
    /* 프로파일 버튼 클릭시 생성되는 플로팅창 */
    const [isDivVisible, setDivVisible] = useState(false); // div 표시 여부를 관리하는 상태

    // 사용자 정보 받아오기
    useEffect(() => {
        const fetchUserInfo = async () => {
            if (token) {
                try {
                    const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/authTest/google`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: token, // JWT 토큰을 문자열로 변환하여 요청 본문에 포함
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }

                    const data = await response.json(); // JSON 형식으로 응답 본문 변환
                    setUserInfo(data); // 받아온 유저 정보를 상태에 저장
                } catch (error) {
                    console.error('Error fetching user info:', error);
                }
            }
        };

        fetchUserInfo();
    }, [token]); // token이 변경될 때마다 실행

    const [quizNotifications, setQuizNotifications] = useState([]); // 상태 관리
    useEffect(() => {
        const fetchNotReadyQuizList = async () => {
            try {
                if (token !== null) {
                    const response = await fetch('http://localhost:8080/quiz/notReadyQuizList', {
                        method: 'GET',
                        headers: {
                            'accept': '*/*',
                            'Authorization': `Bearer ${token}`, // 로컬 스토리지에서 토큰 가져오기
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setQuizNotifications(data); // 기존 데이터에 새 데이터 추가
                    }
                }
            } catch (error) {
                console.error('Error fetching quiz notifications:', error);
            }
        };

        // 2분마다 실행
        const interval = setInterval(fetchNotReadyQuizList, 2 * 60 * 1000);
        fetchNotReadyQuizList(); // 컴포넌트 마운트 시 바로 한 번 실행

        // 컴포넌트 언마운트 시 interval 제거
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="Header">
            <img
                className="logo"
                src={Logo}
                onClick={() => {
                    setFirstCreate(true);
                    navigator('/home');
                    window.location.reload();
                }}
            />
            {
                token ?
                (<div className="profile_div">
                    <img
                        className="profile"
                        src={userInfo ? userInfo.profileImageURL : Profile}
                    />
                    <Button classname={"profile_logout"} onClick={() => setDivVisible(!isDivVisible)} logo={Triangle}/>
                </div>)
                :
                    (<div className="Login_div">
                        <Button text={"로그인"} onClick={handleLogin} classname={"Login"}/>
                    </div>)
            }

            {isDivVisible && (<Profile_logout_floating 
                onclose={() => setDivVisible(false)}
                setToken={setToken}
                setDivVisible={setDivVisible} 
                setRestartQuizId={setRestartQuizId}
                quizNotifications={quizNotifications}
                token={token}
            />)}
        </div>
    )
}

export default Header_top;