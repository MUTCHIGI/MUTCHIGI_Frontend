import './CSS/Profile_logout_floating.css';
import Button from "./Button.jsx";
import Logout from "../../img/로그아웃.png"
import Arrow from "../../img/Arrow.svg"
import {useEffect, useState, useRef} from "react";

function Profile_logout_floating({onclose,setToken,setDivVisible, setRestartQuizId, quizNotifications, token}) {
    const handleLogout = () => {
        setToken(null); // 상태에서 토큰 삭제
        setDivVisible(false);
        localStorage.removeItem('jwtToken'); // 로컬 스토리지에서 토큰 삭제
    };


    // div 외부 클릭시 닫힘
    const ref = useRef();
    useEffect(() => {
        // 컴포넌트 밖의 클릭을 감지하는 함수
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onclose(); // 컴포넌트를 닫는 함수 호출
            }
        };

        // 마우스 클릭 이벤트 리스너 추가
        document.addEventListener('mousedown', handleClickOutside);

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onclose]);

    const [availableQuizzes, setAvailableQuizzes] = useState([]);
    const [notAvailableQuizzes, setNotAvailableQuizzes] = useState([]);
    useEffect(() => {
        const fetchQuizAvailability = async () => {
            const available = [];
            const notAvailable = [];
            for (const quiz of quizNotifications) {
                try {
                    const response = await fetch(
                        `http://localhost:8080/GCP/quiz/DemucsCount?quizId=${quiz.quizId}`, {
                        method: 'GET',
                        headers: {
                            'accept': '*/*',
                            'Authorization': `Bearer ${token}`, // 로컬 스토리지에서 토큰 가져오기
                        }
                });
                    const data = await response.json();
                    if (data.notConvertedQsRelationIDInQuizList.length === 0) {
                        available.push(quiz);
                    }
                    else {
                        notAvailable.push(quiz); // 생성 불가능한 퀴즈
                    }
                } catch (error) {
                    console.error(`Error fetching quiz status for quizId: ${quiz.quizId}`, error);
                }
            }
            setAvailableQuizzes(available);
            setNotAvailableQuizzes(notAvailable);
        };

        fetchQuizAvailability();
    }, [quizNotifications]);

    const restartCreateQuiz = (quizId) => {
        setRestartQuizId(quizId);
    }

    return (
        <div ref={ref} className="Profile_logout_floating">
            {availableQuizzes.map((quiz) => (
                <>
                    <div key={quiz.quizId}
                        className="notification"
                        onClick={() => restartCreateQuiz(quiz.quizId)}
                    >
                        퀴즈 ({quiz.quizName.length > 10
                            ? `${quiz.quizName.slice(0, 10)}...`
                            : quiz.quizName}
                        )를 <br />
                        생성 할 수 있습니다!
                        <div className="notification-text">
                            이어가기
                            <img src={Arrow} className="notification-logo" />
                        </div>
                    </div>
                </>
            ))}
            {notAvailableQuizzes.map((quiz) => (
                <>
                    <div key={quiz.quizId}
                        className="notification"
                    >
                        퀴즈 ({quiz.quizName.length > 10
                            ? `${quiz.quizName.slice(0, 10)}...`
                            : quiz.quizName}
                        )를 <br />
                        생성 중 입니다...
                    </div>
                </>
            ))}
            <div className="Logout" onClick={handleLogout}>
                Logout
                <img src={Logout} className="Logout_img"/>
            </div>
        </div>
    )
}

export default Profile_logout_floating;