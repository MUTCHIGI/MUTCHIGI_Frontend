import './CSS/Game_board_playing.css';
import Button from "../Public/Button.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {useAuth} from "../Login/AuthContext.jsx";
import YouTubePlayer from "./YouTubePlayer.jsx";

function Game_board_playing({stompClient,setFirstCreate,
                                handlSkipVote,userInfo,
    qsRelationId,
    setSkip,skipCount,setSkipCount,UserCount,
    quiz,hint,timelimit,
    roomName,
    songIndex,setSongIndex,songCount,
    answer,answerChat,setAnswerChat,
    answerChatList,setAnswerChatList,
    answerCount,setAnswerCount,userList,
}) {
    const [timeout,setTimeOut] = useState(false);
    const navigate = useNavigate();
    const timeStamp = quiz.timeStamp;
    const songURL = quiz.songURL;
    const originalSongURL = quiz.originalSongURL;
    const [videoUrl, setVideoUrl] = useState('');
    const [originUrl,setOriginUrl] = useState('');
    const [songType,setSongType] = useState(true);
    let {token} = useAuth()
    const skipRatio = skipCount/UserCount;
    const [percentage, setPercentage] = useState(0); // 시간 흐름 표현
    const [progress, setProgress] = useState(0); // 시간 표현 state
    const [timeleft,setTimeLeft] = useState(0); // 남은 시간 (초 단위)
    const [whentoend,setWhenToEnd] = useState(null);
    const [currentHint, setCurrentHint] = useState([]); // 추가된 힌트들
    const intervalRef1 = useRef(null); // 첫 번째 interval
    const intervalRef2 = useRef(null); // 두 번째 interval
    const intervalRef3 = useRef(null); // 세 번째

    const [volume,setVolume] = useState(50);
    const [audioVolume,setAudioVolume] = useState(0.5);
    const audioRef = useRef(null);

    const [videoId,setVideoId] = useState(null);

    console.log(quiz);

    useEffect(() => {
        if(answerChat!==null) {
            if(timeout===false){
                setAnswerChatList((prevChat) => [...prevChat,answerChat])
                setTimeOut(true);
                clearInterval(intervalRef1.current)
            }
        }
    }, [answerChat]);

    useEffect(() => {
        if(skipRatio>=0.5 && timeout===false && answerChat===null) {
            setTimeOut(true);
            clearInterval(intervalRef1.current)
        }
    }, [skipRatio,timeout,answerChat]);

    useEffect(() => {
        if(whentoend!==null) {
            // whentoend 값만큼 기다린 후
            const timer = setTimeout(() => {
                if(songIndex+1===songCount) {
                    setAnswerChat(null);
                    setFirstCreate(true);
                    const updatedCount = {...answerCount}

                    userList.forEach((user) => {
                        if(user.userId !== -1 && !(user.name in answerCount)) {
                            updatedCount[user.name] = 0;
                        }
                    })
                    setAnswerCount(updatedCount);
                    // 방과의 연결 해제
                    if (stompClient && stompClient.connected) {
                        stompClient.disconnect(() => {
                            console.log("Disconnected from room");
                        });
                    }
                    navigate('/game-stat');
                }
                else {
                    setAnswerChat(null);
                    setTimeOut(false);
                    setVideoUrl('');
                    setOriginUrl('');
                    setPercentage(0);
                    setProgress(0);
                    if (intervalRef1.current) {
                        clearInterval(intervalRef1.current);
                        intervalRef1.current = null;
                    }
                    setWhenToEnd(null);
                    setCurrentHint([]);
                    setSkip(false);
                    setSkipCount(0);
                    setAnswerChatList([]);
                    setSongIndex(songIndex+1);
                }
            }, whentoend * 1000); // 초단위로 주어지므로 밀리초로 변환

            // 컴포넌트가 언마운트되거나, whentoend 값이 변경되면 타이머 정리
            return () => clearTimeout(timer);
        }
    }, [whentoend,answerCount]);

    const fetchAudio = async () => {
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
        if(url) {
            const videoId = url.split('v=')[1];
            if (videoId) {
                return videoId.split('&')[0];
            }
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

        if (videoId) {
            setSongType(true);
        }
        else {
            fetchAudio();
            setSongType(false);
        }

        return () => {
            // API 로드 시 부작용 제거
            delete window.onYouTubeIframeAPIReady;
        };
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
        ///////////// 로딩바
        if(intervalRef1.current) {
            clearInterval(intervalRef1.current);
        }
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


        ////////////////// 남은시간
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

        ///////////// 힌트
        let index=0;
        let currentTime = 0;
        // 힌트들을 초로 변환한 배열을 미리 준비
        const hintTimesInSeconds = hint.map(hint => ({
            ...hint,
            timeInSeconds: convertTimeToSeconds(hint.hintTime)
        }));

        // 컴포넌트가 렌더링될 때마다 이전 interval을 클리어
        if (intervalRef3.current) {
            clearInterval(intervalRef3.current);
        }

        intervalRef3.current = setInterval(() => {
            if(index<hintTimesInSeconds.length && currentTime+1 >= hintTimesInSeconds[index].timeInSeconds) {
                setCurrentHint((prevHints) => [...prevHints,hintTimesInSeconds[index]]);
                setTimeout(() => {
                    index += 1; // `setCurrentHint` 이후에 증가
                }, 0);
            }
            currentTime = currentTime+1;
        }, 1000);
    }

    useEffect(() => {
        setTimeOut(false);
        setProgress(0);
        setPercentage(0);
        clearInterval(intervalRef1.current)
    }, [qsRelationId]);


    useEffect(() => {
        if(audioRef.current){
            audioRef.current.volume = audioVolume;
        }
    }, [audioVolume]);

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

    const handleVolume = (e) => {
        setVolume(e.target.value);
        setAudioVolume((e.target.value)/100);
    }

    return <div className="Game_board_waiting">
        <div className="volume_bar">
            <div>Volume : {volume}%</div>
            <input
                className="volume_input"
                type="range"
                id="volume-slider"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolume} // 슬라이더 값 변경 시 volume 상태 업데이트
            />
        </div>
        <div className="skip_state">
            {skipCount} / {Math.ceil(UserCount/2)} Skip Voted! {skipRatio >= 0.5 && <>노래를 생략합니다.</>}
        </div>
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
                                songType ?
                                    <YouTubePlayer
                                        songURL={songURL}
                                        startTime={startTime}
                                        endTime={endTime}
                                        onVideoLoad={onVideoLoad}
                                        volume={volume}
                                    />
                                    :
                                    <audio
                                        ref={audioRef}
                                        src={videoUrl}
                                        preload="auto"
                                        autoPlay // 자동 재생
                                        onPlaying={onVideoLoad}
                                        onLoadedMetadata={handleLoadedMetadata} // 메타데이터 로드 시 시작 시간 설정
                                        onTimeUpdate={handleTimeUpdate} // 현재 시간 업데이트 시 종료 시간 확인
                                        style={{display: "none"}}
                                    />
                            )
                            :
                            <YouTubePlayer
                                songURL={originalSongURL}
                                startTime={startTime + progress}
                                endTime={startTime + progress + 5}
                                volume={volume}
                            />
                        }

                        {(timeout === false && answerChat === null) ?
                            <div className="play_bar_time_outer">
                                <div className="play_bar_time_inner"
                                     style={{
                                         width: `${100-percentage}%`
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
            {(answerChat !== null) && (answerChatList.length > 0) &&
                <>
                    <span className="correct_bold">정답자</span> : {answerChatList[0].answerUserName}
                </>
            }
        </div>
    </div>
}

export default Game_board_playing;