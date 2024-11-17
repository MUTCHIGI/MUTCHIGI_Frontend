import './CSS/Game_board_playing.css';
import Button from "../Public/Button.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {useAuth} from "../Login/AuthContext.jsx";

function Game_board_playing({stompClient,setFirstCreate,
                                handlSkipVote,userInfo,
    qsRelationId,
    setSkip,skipCount,setSkipCount,UserCount,
    quiz,hint,timelimit,
    roomName,
    songIndex,setSongIndex,songCount,
    answer,answerChat,setAnswerChat,
}) {
    console.log(quiz)
    const [timeout,setTimeOut] = useState(false);
    const navigate = useNavigate();
    const timeStamp = quiz.timeStamp;
    const songURL = quiz.songURL;
    const originalSongURL = quiz.originalSongURL;
    const [videoUrl, setVideoUrl] = useState('');
    const [originUrl,setOriginUrl] = useState('');
    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const [songType,setSongType] = useState(true);
    let {token} = useAuth()

    const skipRatio = skipCount/UserCount;

    const [percentage, setPercentage] = useState(0); // 시간 흐름 표현
    const [progress, setProgress] = useState(-0.2); // 시간 표현 state

    const [timeleft,setTimeLeft] = useState(0); // 남은 시간 (초 단위)

    const [whentoend,setWhenToEnd] = useState(null);

    const [currentHint, setCurrentHint] = useState([]); // 추가된 힌트들
    const [currentTime, setCurrentTime] = useState(0);  // 현재 시간 상태
    const [index, setIndex] = useState(0);             // 힌트 배열의 인덱스
    const [intervalId, setIntervalId] = useState(null); // 타이머 ID

    const intervalRef1 = useRef(null); // 첫 번째 interval
    const intervalRef2 = useRef(null); // 두 번째 interval
    const intervalRef3 = useRef(null); // 세 번째

    useEffect(() => {
        console.log(quiz)
    }, [qsRelationId]);

    useEffect(() => {
        if(answerChat!==null) {
            setTimeOut(true) ;
        }
    }, [answerChat]);

    useEffect(() => {
        if(skipRatio>=0.5 && timeout===false && answerChat===null) {
            setTimeOut(true);
        }
    }, [skipRatio,timeout,answerChat]);

    useEffect(() => {
        if(whentoend!==null) {
            // whentoend 값만큼 기다린 후
            const timer = setTimeout(() => {
                if(songIndex+1===songCount) {
                    alert("게임이 종료되었습니다. 메인화면으로 이동합니다.");
                    // 방과의 연결 해제
                    if (stompClient && stompClient.connected) {
                        stompClient.disconnect(() => {
                            console.log("Disconnected from room");
                        });
                    }
                    // /home 경로로 이동
                    setAnswerChat(null);
                    setFirstCreate(true);
                    navigate('/home');
                    window.location.reload();
                }
                else {
                    setAnswerChat(null);
                    setTimeOut(false);
                    setVideoUrl('');
                    setOriginUrl('');
                    setPercentage(0);
                    setProgress(-0.2);
                    if (intervalRef1.current) {
                        clearInterval(intervalRef1.current);
                        intervalRef1.current = null;
                    }
                    setWhenToEnd(null);
                    setCurrentTime(0);
                    setCurrentHint([]);
                    setIndex(0);
                    setSkip(false);
                    setSkipCount(0);
                    setSongIndex(songIndex+1);
                }
            }, whentoend * 1000); // 초단위로 주어지므로 밀리초로 변환

            // 컴포넌트가 언마운트되거나, whentoend 값이 변경되면 타이머 정리
            return () => clearTimeout(timer);
        }
    }, [whentoend]);

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
        window.location.reload();
    };

    const fetchAudio = async () => {
        console.log("이거 실행되긴함")
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/GCP/DemucsSong/play/inRoom?qsRelationId=${qsRelationId}` , {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': '*/*'
                }
            });
            if(response.ok) {
                const blob = await response.blob();
                if(blob.size>0) {
                    const url = URL.createObjectURL(blob);
                    setVideoUrl(url);
                }
            }

        } catch (error) {
            console.log("error fectching audio file :",error);
        }
    }

    // YouTube 비디오 ID 추출 함수
    const getYouTubeVideoId = (url) => {
        const videoId = url.split('v=')[1];
        if (videoId) {
            return videoId.split('&')[0];
        }
        return null;
    };

    // 시간 (HH:MM:SS)을 초로 변환하는 함수
    const convertTimeToSeconds = (timeStr) => {
        if(timeStr) {
            const timeParts = timeStr.split(':');
            const hours = parseInt(timeParts[0], 10);
            const minutes = parseInt(timeParts[1], 10);
            const seconds = parseInt(timeParts[2], 10);
            return hours * 3600 + minutes * 60 + seconds;
        }
        return 0;
    };

    // 시작 시간과 제한 시간에 맞게 URL을 조작
    const startTime = convertTimeToSeconds(timeStamp);
    const endTime = startTime + convertTimeToSeconds(timelimit);

    useEffect(() => {
        const videoId = getYouTubeVideoId(songURL);
        console.log(videoId)
        if (videoId) {
            const url = `https://www.youtube.com/embed/${videoId}?autoplay=1&start=${startTime}&end=${endTime}&rel=0`;
            setVideoUrl(url);
            setSongType(true);
        }
        else {
            console.log("이거 실행됨")
            fetchAudio();
            setSongType(false);
        }
    }, [qsRelationId]);

    useEffect(() => {
        if(answerChat !== null) {
            if(timeout === false) {
                const videoId_origin = getYouTubeVideoId(originalSongURL);

                if(videoId_origin) {
                    const url_origin = `https://www.youtube.com/embed/${videoId_origin}?autoplay=1&start=${Math.floor(startTime + progress)}&end=${Math.floor(startTime + progress)+5}&rel=0`;
                    setOriginUrl(url_origin);
                    setWhenToEnd(6);
                }
            }
        }
        else {
            if(timeout === true) {
                const videoId_origin = getYouTubeVideoId(originalSongURL);
                if(videoId_origin) {
                    const url_origin = `https://www.youtube.com/embed/${videoId_origin}?autoplay=1&start=${Math.floor(startTime + progress)}&end=${Math.floor(startTime + progress)+5}&rel=0`;
                    setOriginUrl(url_origin);
                    setWhenToEnd(7);
                }
            }
        }
    }, [timeout,answerChat]);

    const duration = convertTimeToSeconds(timelimit);

    function onVideoLoad() {
        console.log("로딩됨!")
        if(!intervalRef1.current){
            intervalRef1.current = setInterval(() => {
                setProgress((prevProgress) => {
                    const newProgress = prevProgress + 0.01; // 1초마다 1씩 증가
                    if (newProgress <= duration) {
                        setPercentage((newProgress / duration) * 100); // percentage 계산
                        return newProgress;
                    } else {
                        setTimeOut(true);
                        clearInterval(intervalRef1.current); // duration에 도달하면 interval 종료
                        return duration; // currentProgress는 duration으로 고정
                    }
                });
            }, 10); // 1초마다 실행
        }
    }

    useEffect(() => {
        setTimeOut(false);
        setProgress(-0.2);
        setPercentage(0);
        clearInterval(intervalRef1.current)
    }, [qsRelationId]);
    // useEffect(() => {
    //     // 현재 진행 상태를 초기화
    //     setTimeOut(false)
    //     setProgress(-0.2);
    //     setPercentage(0);
    //
    //     // onVideoLoad 함수: ref1이 로드되면 실행
    //     function onVideoLoad() {
    //         if(!intervalRef1.current){
    //             intervalRef1.current = setInterval(() => {
    //                 setProgress((prevProgress) => {
    //                     const newProgress = prevProgress + 0.01; // 1초마다 1씩 증가
    //                     if (newProgress <= duration) {
    //                         setPercentage((newProgress / duration) * 100); // percentage 계산
    //                         return newProgress;
    //                     } else {
    //                         setTimeOut(true);
    //                         clearInterval(intervalRef1.current); // duration에 도달하면 interval 종료
    //                         return duration; // currentProgress는 duration으로 고정
    //                     }
    //                 });
    //             }, 10); // 1초마다 실행
    //         }
    //     }
    //
    //     console.log(ref1.current)
    //     // ref1이 iframe일 때의 처리
    //     if (ref1.current && ref1.current.tagName === "IFRAME") {
    //         console.log("프레임")
    //         ref1.current.addEventListener("load", onVideoLoad);
    //     }
    //
    //     // ref1이 audio일 때의 처리
    //     if (ref1.current && ref1.current.tagName === "AUDIO") {
    //         console.log("오디오")
    //         ref1.current.addEventListener("play", onVideoLoad);
    //     }
    //
    //     // 클린업 함수: 컴포넌트 언마운트 시 interval 정리
    //     return () => {
    //         if (ref1.current) {
    //             if (ref1.current.tagName === "IFRAME") {
    //                 ref1.current.removeEventListener("load", onVideoLoad);
    //             }
    //             if (ref1.current.tagName === "AUDIO") {
    //                 ref1.current.removeEventListener("play", onVideoLoad);
    //             }
    //         }
    //         if (intervalRef1.current) {
    //             clearInterval(intervalRef1.current); // interval 종료
    //         }
    //     };
    // }, [songIndex]);

    // 두 번째 인터벌: timeLeft가 0이 될 때까지 1초마다 감소
    useEffect(() => {
        setTimeLeft(duration);

        // 컴포넌트가 렌더링될 때마다 이전 interval을 클리어
        if (intervalRef2.current) {
            clearInterval(intervalRef2.current);
        }

        intervalRef2.current = setInterval(() => {
            setTimeLeft((prevTimeLeft) => {
                if (prevTimeLeft > 0) {
                    return prevTimeLeft - 1; // 1초마다 1씩 감소
                } else {
                    clearInterval(intervalRef2.current); // 0이 되면 타이머 종료
                    return 0;
                }
            });
        }, 1000);

        return () => {
            clearInterval(intervalRef2.current);
            intervalRef2.current=null;
        };
    }, [qsRelationId]);

    // 힌트들을 초로 변환한 배열을 미리 준비
    const hintTimesInSeconds = hint.map(hint => ({
        ...hint,
        timeInSeconds: convertTimeToSeconds(hint.hintTime)
    }));

    // 세 번째 인터벌: currentTime을 1초마다 증가시키기
    useEffect(() => {
        // 컴포넌트가 렌더링될 때마다 이전 interval을 클리어
        if (intervalRef3.current) {
            clearInterval(intervalRef3.current);
        }

        intervalRef3.current = setInterval(() => {
            setCurrentTime((prevTime) => {
                const newTime = prevTime + 1;
                if (newTime <= duration) {
                    return newTime;
                } else {
                    clearInterval(intervalRef3.current); // duration을 넘으면 타이머 종료
                    return newTime;
                }
            });
        }, 1000);

        return () => {
            clearInterval(intervalRef3.current);
        };
    }, [qsRelationId]);

    useEffect(() => {
        // 현재 시간(currentTime)과 힌트의 시간(timeInSeconds)을 비교하여
        // 조건을 만족하는 힌트를 currentHint에 추가
        if ((index < hintTimesInSeconds.length) && (currentTime >= hintTimesInSeconds[index].timeInSeconds)) {
            setCurrentHint(prevHints => [...prevHints, hintTimesInSeconds[index]]);
            setIndex(prevIndex => prevIndex + 1); // 인덱스를 하나씩 증가
        }
    }, [currentTime]);

    const handleLoadedMetadata = (e) => {
        const audio = e.target;
        // 오디오가 로드된 후 시작 시간 설정
        audio.currentTime = startTime;
    };

    const handleTimeUpdate = (e) => {
        const audio = e.target;
        // 종료 시간에 도달하면 일시정지
        if (audio.currentTime >= endTime) {
            audio.pause();
        }
    };

    return <div className="Game_board_waiting">
        <div className="title_exit_share">
            <div className="game_board_title">
                {roomName}
            </div>
            {/*<Button text={"exit"} classname={"game_exit"} onClick={handleExit}/>*/}
            <Button text={"share"} classname={"game_share"}/>
        </div>
        <div className="current_div_total">
            {songIndex + 1} / {songCount} songs
        </div>
        {answerChat === null &&
            <div className="remaining_time">
                {timeleft} 초
            </div>
        }
        <div className="playing_skip">
            <div className="play_bar">
                <div className="current_song_ratio">
                    <div>
                        {(timeout === false && answerChat === null) ? (
                                songType ? <iframe
                                    key={videoUrl}
                                    ref={ref1}
                                    className="quiz_playing_frame_1"
                                    src={videoUrl}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    style={{display: "none"}}
                                    onLoad={onVideoLoad}
                                /> :
                                    <audio
                                        ref={ref1}
                                        src={videoUrl}
                                        preload="auto"
                                        autoPlay // 자동 재생
                                        onPlay={onVideoLoad}
                                        onLoadedMetadata={handleLoadedMetadata} // 메타데이터 로드 시 시작 시간 설정
                                        onTimeUpdate={handleTimeUpdate} // 현재 시간 업데이트 시 종료 시간 확인
                                        style={{display:"none"}}
                                    />
                            )
                            :
                            <iframe
                                ref={ref2}
                                className="quiz_playing_frame_2"
                                src={originUrl}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                style={{display: "none"}}
                            />
                        }

                        {(timeout === false && answerChat === null) ?
                            <div className="play_bar_time_outer">
                                <div className="play_bar_time_inner"
                                     style={{
                                         width: `${percentage}%`
                                     }}
                                />
                            </div> :
                            <div className="current_answer">
                                <div className="answer_top">
                                    정답 : <span className="ans">{answer[0]}</span>
                                </div>
                                <div className="get_next">
                                    다음 퀴즈의 정보를 받아오고 있습니다...
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
            {timeout === false ?
                <Button text={`skip!`} classname={"skip"} onClick={handlSkipVote}/> :
                <Button text={`skip!`} classname={"skip"}/>
            }
        </div>
        {timeout === false && answerChat === null &&
            <div className="hint">
                {currentHint.map((hint, index) => (
                    <div key={index} className="hint_1">
                        Hint {index + 1} : <span className="hint_bold">{hint.hintType}</span> - {hint.hintText}
                    </div>
                ))}
            </div>
        }
        <div className="user_correct">
            {(answerChat !== null) &&
                <>
                    <span className="correct_bold">정답자</span> : {answerChat.answerUserName}
                </>
            }
        </div>
        <div className="skip_state">
            {skipCount} / {UserCount} Skip Voted! {skipRatio>=0.5 && <>노래를 생략합니다.</>}
        </div>
    </div>
}

export default Game_board_playing;