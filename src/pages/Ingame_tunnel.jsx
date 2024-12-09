import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useAuth} from "../components/Login/AuthContext.jsx";
import WarningModal from "../components/Public/Error.jsx";

function Ingame_tunnel({setUserInfo,setChatRoomId,
    setSelectedQuiz,setPassword,setRoomName,
}) {
    let navigate = useNavigate();
    let {token} = useAuth();
    const {chatRoomId} = useParams();
    // 에러 모달
    const [err, setError] = useState({ hasError: false, title: "", message: "" });
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
                    setChatRoomId(chatRoomId);
                } catch (error) {
                    console.error('Error fetching user info:', error);
                }
            }
            else {
                setError({
                    ...err,
                    hasError: true,
                    title: "입장 불가능",
                    message: '로그인이후 방에 입장가능합니다.'
                });
            }
        };
        const fetchRoomInfo = async () => {
            if(token) {
                try {
                    const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/room/Entities?idList=${chatRoomId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();

                        if (data[0].participateAllowed) {
                            setChatRoomId(data[0].roomId);
                            setSelectedQuiz(data[0].quiz);
                            setPassword("");
                            setRoomName(data[0].roomName);
                            navigate(`/ingame`);  // '/ingame'으로 네비게이션
                        } else {
                            console.log("오류");
                        }

                    } else {
                        console.error('데이터를 가져오는 데 실패했습니다.');
                    }
                } catch (error) {
                    console.error('GET 요청 중 오류 발생:', error);
                }
            }
            else {
                setError({
                    ...err,
                    hasError: true,
                    title: "입장 불가능",
                    message: '로그인 이후 방에 입장 가능합니다. 로그인 페이지로 이동합니다.'
                });
            }
        };

        fetchUserInfo();
        fetchRoomInfo();
    }, []); // token이 변경될 때마다 실행

    const handleClose = () => {
        setError({
            ...err,
            hasError: false,
            title: "",
            message: ""
        });
        navigate('/');
    };

    return <div>
        <WarningModal
            show={err.hasError}
            setError={(flag) => setError(flag)}
            title={err.title}
            message={err.message}
            onHide={handleClose}
        />
    </div>
}

export default Ingame_tunnel;