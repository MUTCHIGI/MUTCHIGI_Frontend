import './CSS/Game_board_waiting.css';
import Button from "../Public/Button.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import WarningModal from "../Public/Error.jsx";

function Game_board_waiting({stompClient,
                                chatRoomId,
                                setFirstCreate,
                                qsRelationId,
                                songIndex,
                                setSongIndex,
                                roomName,
                                master,
                                UserCount,
                                setGameStart}) {
    const navigate = useNavigate();
    const location = useLocation();
    const [countdown, setCountdown] = useState(null); // 카운트다운 초기 상태
    const [secondsRemaining,setSecondsRemaining] = useState(5);
    // 에러 모달
    const [err, setError] = useState({ hasError: false, title: "", message: "" });
    const handleExit = () => {
        // 방과의 연결 해제
        if (stompClient && stompClient.connected) {
            stompClient.disconnect(() => {
                console.log("Disconnected from room");
            });
        }
        // /home 경로로 이동
        setFirstCreate(true);
        navigate('/home');
    };

    const handleClose = () => {
        setError({
            ...err,
            hasError: false,
            title: "",
            message: ""
        });
    };

    const copyToClipboard = async () => {
        const fullUrl = `${window.location.origin}${location.pathname}/${chatRoomId}`;

        try {
            await navigator.clipboard.writeText(fullUrl); // 클립보드에 복사
            setError({
                ...err,
                hasError: true,
                title: "복사 완료",
                message: '링크를 공유해 다른사람들과 게임을 플레이하세요!'
            });
        } catch (error) {
            console.error("클립보드 복사 실패:", error);
        }
    };

    const handleStartClick = () => {
        setCountdown(`${secondsRemaining}초 뒤 시작합니다`);
        setSongIndex(songIndex+1);

        const intervalId = setInterval(() => {
            setSecondsRemaining((prev) => {
                const newTime = prev - 1;

                if (newTime > 0) {
                    setCountdown(`${newTime}초 뒤 시작합니다`);
                } else {
                    setCountdown("게임이 시작됩니다!");
                    clearInterval(intervalId); // 카운트다운 완료 후 인터벌 종료
                    setGameStart(true);
                }

                return newTime;
            });
        }, 1000);
    };

    useEffect(() => {
        if (qsRelationId!==-1 && !master) { // qsRelationId가 존재할 때만 실행
            setSongIndex(songIndex+1);
            setSecondsRemaining(5); // 카운트다운을 5초로 초기화
            setCountdown(`${secondsRemaining}초 뒤 시작합니다`); // 카운트다운 초기 메시지

            const intervalId = setInterval(() => {
                setSecondsRemaining((prev) => {
                    const newTime = prev - 1;

                    if (newTime > 0) {
                        setCountdown(`${newTime}초 뒤 시작합니다`);
                    } else {
                        setCountdown("게임이 시작됩니다!");
                        clearInterval(intervalId); // 카운트다운 완료 후 인터벌 종료
                        setGameStart(true); // 게임 시작 상태 설정
                    }

                    return newTime;
                });
            }, 1000);

            // 클린업 함수: 컴포넌트가 언마운트되거나 qsRelationId가 변경되면 인터벌을 정리
            return () => {
                clearInterval(intervalId);
            };
        }
    }, [qsRelationId, master]); // qsRelationId 또는 master 값이 변경될 때만 실행

    return <div className="Game_board_waiting">
        <WarningModal
            show={err.hasError}
            setError={(flag) => setError(flag)}
            title={err.title}
            message={err.message}
            onHide={handleClose}
        />
        <div className="title_exit_share">
            <div className="game_board_title">
                {roomName}
            </div>
            {secondsRemaining > 2 ?
                <Button text={"exit"} classname={"game_exit"} onClick={handleExit}/> :
                <Button text={"exit"} classname={"game_exit_deactivated"}/>
            }

            <Button text={"share"} classname={"game_share"} onClick={copyToClipboard}/>
        </div>
        <div className="ready_box">
            {!master ?
                <Button text={countdown ? countdown : "waiting for start..."} classname={"game_wait"}/> :
                <Button text={countdown ? countdown : "Start!"} classname={"game_ready"} onClick={handleStartClick}/>
            }
        </div>
        <div className="ready_proportion">
            {UserCount} Players Waiting!
        </div>
    </div>
}

export default Game_board_waiting;