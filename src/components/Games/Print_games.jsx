import './CSS/Print_games.css'
import Game_item from "./Game_item.jsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Password_input from "../Public/Password_input.jsx";
import Thumbnail from '../../img/QuizItemTest/no_img.png';
import WarningModal from '../Public/Error';

/* 만약 room이 null값이면 출력안하는게 아니라 그만큼 빈자리에 빈 div를 출력함 */
/* Footer 버튼 방 생성 버튼으로 바꾸는거 추가 */
function Print_games({ roomIds, setChatRoomId, setFirstCreate,
    selectedQuiz, setSelectedQuiz, selectedOption_privacy,
    password, setPassword, setRoomName,
}) {
    // 방의 기본값 설정
    const emptyRoomTemplate = {
        roomId: null,
        roomName: '',
        publicRoom: true,
        password: '',
        maxPlayer: 0,
        participateAllowed: true,
        roomReleaseDate: '',
        quiz: {
            quizId: null,
            songCount: 0,
            quizName: '',
            quizDescription: '',
            releaseDate: '',
            userPlayCount: 0,
            typeId: 0,
            modId: 0,
            hintCount: 0,
            songPlayTime: {
                hour: 0,
                minute: 0,
                second: 0,
                nano: 0,
            },
            thumbnailURL: '',
            instrumentId: 0,
            readyToPlay: true,
            user: {
                userId: null,
                platformUserId: '',
                email: '',
                name: '',
                profileImageURL: '',
                role: 'User',
                provider: {
                    id: null,
                    providerName: '',
                },
            },
            useDisAlg: false,
        },
    };

    // 방 정보들을 담을 상태 선언
    const [rooms, setRooms] = useState(Array(6).fill(emptyRoomTemplate)); // 초기값을 6개의 빈 방으로 설정
    const [selectedRoom, setSelectedRoom] = useState(null);

    const [thumbnailURL, setThumbnailURL] = useState([]);
    const [imageSrc, setImageSrc] = useState([]);
    const navigate = useNavigate();
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    
    // 에러 모달
    const [err, setError] = useState({ hasError: false, title: "", message: "" });

    // roomIds 배열을 가지고 API 요청을 보내는 함수
    useEffect(() => {
        setRooms(Array(6).fill(emptyRoomTemplate))

        const fetchRooms = async () => {
            try {
                // quizIds가 비어있지 않은 경우에만 요청을 보냄
                if (roomIds.length === 0) {
                    return;
                }

                // 모든 quizId를 queryString으로 변환하여 요청 URL 구성
                const queryString = roomIds.map(id => `idList=${id}`).join('&');
                const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/room/Entities?${queryString}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                // 7개 미만인 경우 빈 퀴즈 객체를 추가
                const filledRooms = [...data];
                while (filledRooms.length < 6) {
                    filledRooms.push(emptyRoomTemplate);
                }
                setRooms(filledRooms); // 성공적으로 받아온 데이터 저장
            } catch (error) {
                console.error('Failed to fetch quiz entities:', error);
            }
        };

        fetchRooms();
    }, [roomIds]);

    useEffect(() => {
        const urls = rooms.map((room) => room.quiz.thumbnailURL);
        setThumbnailURL(urls);
        let string = "";
        let string2 = string.split('v=')[1];
    }, [rooms]);

    useEffect(() => {
        const fetchImage = async (url) => {
            if (url === "" || url === null) {
                // 빈 문자열이면 그냥 빈 문자열 저장
                return "";
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/quiz/images/${url}`);
                if (response.ok) {
                    const data = await response.blob();
                    // Blob URL을 생성하여 반환
                    const image = URL.createObjectURL(data);
                    return image; // 생성된 이미지 URL 반환
                } else {
                    console.error("Failed to fetch image:", response.status);
                    return ""; // 실패한 경우 빈 문자열 반환
                }
            } catch (error) {
                console.error("Error fetching image:", error);
                return ""; // 오류 발생시 빈 문자열 반환
            }
        };

        const updateImageSrc = async () => {
            const newImageSrc = [];

            for (let i = 0; i < thumbnailURL.length; i++) {
                const image = await fetchImage(thumbnailURL[i]);
                newImageSrc.push(image);
            }
            setImageSrc(newImageSrc)
        }

        if (thumbnailURL.length > 0) {
            updateImageSrc(); // quizThumbURL이 업데이트될 때마다 이미지 데이터 요청
        }
    }, [thumbnailURL]); // quizThumbURL이 변경될 때마다 실행


    const handleClick_0 = async () => {
        if (rooms[0].roomId !== null) {  // room.id가 null이 아닐 때
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/room/Entities?idList=${rooms[0].roomId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data[0].participateAllowed) {
                        setChatRoomId(rooms[0].roomId);
                        setFirstCreate(false);
                        setSelectedQuiz(rooms[0].quiz);
                        setPassword("");
                        setRoomName(rooms[0].roomName);
                        console.log(rooms[0].roomName);
                        navigate('/ingame');  // '/ingame'으로 네비게이션
                    } else {
                        // window.alert('이미 게임이 시작되었거나 인원이 꽉 찼습니다');
                        setError({
                            ...err,
                            hasError: true,
                            title: "입장 불가능",
                            message: '이미 게임이 시작되었거나 인원이 꽉 찼습니다'
                          });
                        // navigate('/home');
                    }

                } else {
                    console.error('데이터를 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                setError({
                    ...err,
                    hasError: true,
                    title: "입장 불가능",
                    message: '유효하지 않은 방입니다. 새로고침하여주십시오.'
                });
                console.error('GET 요청 중 오류 발생:', error);
            }
        }
    };
    const handleClick_1 = async () => {
        if (rooms[1].roomId !== null) {  // room.id가 null이 아닐 때
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/room/Entities?idList=${rooms[1].roomId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data[1].participateAllowed) {
                        setChatRoomId(rooms[1].roomId);
                        setFirstCreate(false);
                        setSelectedQuiz(rooms[1].quiz);
                        setRoomName(rooms[1].roomName);
                        setPassword("");
                        navigate('/ingame');  // '/ingame'으로 네비게이션
                    } else {
                        // window.alert('이미 게임이 시작되었거나 인원이 꽉 찼습니다');
                        setError({
                            ...err,
                            hasError: true,
                            title: "입장 불가능",
                            message: '이미 게임이 시작되었거나 인원이 꽉 찼습니다'
                          });
                        // navigate('/home');
                    }

                } else {
                    console.error('데이터를 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                setError({
                    ...err,
                    hasError: true,
                    title: "입장 불가능",
                    message: '유효하지 않은 방입니다. 새로고침하여주십시오.'
                });
                console.error('GET 요청 중 오류 발생:', error);
            }
        }
    };
    const handleClick_2 = async () => {
        if (rooms[2].roomId !== null) {  // room.id가 null이 아닐 때
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/room/Entities?idList=${rooms[2].roomId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data[2].participateAllowed) {
                        setChatRoomId(rooms[2].roomId);
                        setFirstCreate(false);
                        setSelectedQuiz(rooms[2].quiz);
                        setRoomName(rooms[2].roomName);
                        setPassword("");
                        navigate('/ingame');  // '/ingame'으로 네비게이션
                    } else {
                        // window.alert('이미 게임이 시작되었거나 인원이 꽉 찼습니다');
                        setError({
                            ...err,
                            hasError: true,
                            title: "입장 불가능",
                            message: '이미 게임이 시작되었거나 인원이 꽉 찼습니다'
                          });
                        // navigate('/home');
                    }

                } else {
                    console.error('데이터를 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                setError({
                    ...err,
                    hasError: true,
                    title: "입장 불가능",
                    message: '유효하지 않은 방입니다. 새로고침하여주십시오.'
                });
                console.error('GET 요청 중 오류 발생:', error);
            }
        }
    };
    const handleClick_3 = async () => {
        if (rooms[3].roomId !== null) {  // room.id가 null이 아닐 때
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/room/Entities?idList=${rooms[3].roomId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data[3].participateAllowed) {
                        setChatRoomId(rooms[3].roomId);
                        setFirstCreate(false);
                        setSelectedQuiz(rooms[3].quiz);
                        setRoomName(rooms[3].roomName);
                        setPassword("");
                        navigate('/ingame');  // '/ingame'으로 네비게이션
                    } else {
                        // window.alert('이미 게임이 시작되었거나 인원이 꽉 찼습니다');
                        setError({
                            ...err,
                            hasError: true,
                            title: "입장 불가능",
                            message: '이미 게임이 시작되었거나 인원이 꽉 찼습니다'
                          });
                        // navigate('/home');
                    }

                } else {
                    console.error('데이터를 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                setError({
                    ...err,
                    hasError: true,
                    title: "입장 불가능",
                    message: '유효하지 않은 방입니다. 새로고침하여주십시오.'
                });
                console.error('GET 요청 중 오류 발생:', error);
            }
        }
    };
    const handleClick_4 = async () => {
        if (rooms[4].roomId !== null) {  // room.id가 null이 아닐 때
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/room/Entities?idList=${rooms[4].roomId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data[4].participateAllowed) {
                        setChatRoomId(rooms[4].roomId);
                        setFirstCreate(false);
                        setSelectedQuiz(rooms[4].quiz);
                        setRoomName(rooms[4].roomName);
                        setPassword("");
                        navigate('/ingame');  // '/ingame'으로 네비게이션
                    } else {
                        // window.alert('이미 게임이 시작되었거나 인원이 꽉 찼습니다');
                        setError({
                            ...err,
                            hasError: true,
                            title: "입장 불가능",
                            message: '이미 게임이 시작되었거나 인원이 꽉 찼습니다'
                          });
                        // navigate('/home');
                    }

                } else {
                    console.error('데이터를 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                setError({
                    ...err,
                    hasError: true,
                    title: "입장 불가능",
                    message: '유효하지 않은 방입니다. 새로고침하여주십시오.'
                });
                console.error('GET 요청 중 오류 발생:', error);
            }
        }
    };
    const handleClick_5 = async () => {
        if (rooms[5].roomId !== null) {  // room.id가 null이 아닐 때
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/room/Entities?idList=${rooms[5].roomId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    if (data[5].participateAllowed) {
                        setChatRoomId(rooms[5].roomId);
                        setFirstCreate(false);
                        setSelectedQuiz(rooms[5].quiz);
                        setRoomName(rooms[5].roomName);
                        setPassword("");
                        navigate('/ingame');  // '/ingame'으로 네비게이션
                    } else {
                        // window.alert('이미 게임이 시작되었거나 인원이 꽉 찼습니다');
                        setError({
                            ...err,
                            hasError: true,
                            title: "입장 불가능",
                            message: '이미 게임이 시작되었거나 인원이 꽉 찼습니다'
                          });
                        // navigate('/home');
                    }

                } else {
                    console.error('데이터를 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                console.error('GET 요청 중 오류 발생:', error);
                setError({
                    ...err,
                    hasError: true,
                    title: "입장 불가능",
                    message: '유효하지 않은 방입니다. 새로고침하여주십시오.'
                });
            }
        }
    };

    const handleConfirmPassword = async () => {
        if (selectedRoom.roomId !== null) {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/room/Entities?idList=${selectedRoom.roomId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    // participateAllowed가 true일 경우에만 실행
                    if (data[0].participateAllowed) {
                        setChatRoomId(selectedRoom.roomId);
                        setFirstCreate(false);
                        setSelectedQuiz(selectedRoom.quiz);
                        setShowPasswordInput(false); // 모달 닫기
                        navigate('/ingame');  // '/ingame'으로 네비게이션
                    } else {
                        // window.alert('이미 게임이 시작되었거나 인원이 꽉 찼습니다');
                        setError({
                            ...err,
                            hasError: true,
                            title: "입장 불가능",
                            message: '이미 게임이 시작되었거나 인원이 꽉 찼습니다'
                          });
                        setShowPasswordInput(false); // 모달 닫기
                        // navigate('/home');
                    }

                } else {
                    console.error('데이터를 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                console.error('GET 요청 중 오류 발생:', error);
            }
        }
    };

    const handleClose = () => {
        setError({
            ...err,
            hasError: false,
            title: "",
            message: ""
        });
        navigate('/home');
    };

    return <div className="Print_games">
        <WarningModal
            show={err.hasError}
            setError={(flag) => setError(flag)}
            title={err.title}
            message={err.message}
            onHide={handleClose}
        />
        <div className="dash_line" />
        <div className="games_centerbox">
            <Game_item
                room={rooms[0]}
                setChatRoomId={setChatRoomId}
                setFirstCreate={setFirstCreate}
                selectedQuiz={selectedQuiz} setSelectedQuiz={setSelectedQuiz}
                selectedOption_privacy={selectedOption_privacy}
                setPassword={setPassword}
                src={imageSrc[0] ? imageSrc[0] : Thumbnail}
                onClick_private={() => {
                    if (rooms[0].roomId !== null) {
                        setSelectedRoom(rooms[0]);
                        setShowPasswordInput(true);
                        setPassword("");
                        setFirstCreate(false);
                        setSelectedQuiz(rooms[0].quiz);
                        setRoomName(rooms[0].roomName);
                    }
                }}
                onClick_public={handleClick_0}
            />
            <Game_item
                room={rooms[1]}
                setChatRoomId={setChatRoomId}
                setFirstCreate={setFirstCreate}
                selectedQuiz={selectedQuiz} setSelectedQuiz={setSelectedQuiz}
                selectedOption_privacy={selectedOption_privacy}
                setPassword={setPassword}
                src={imageSrc[1] ? imageSrc[1] : Thumbnail}
                onClick_private={() => {
                    if (rooms[1].roomId !== null) {
                        setSelectedRoom(rooms[0]);
                        setShowPasswordInput(true);
                        setPassword("");
                        setFirstCreate(false);
                        setSelectedQuiz(rooms[1].quiz);
                        setRoomName(rooms[1].roomName);
                    }
                }}
                onClick_public={handleClick_1}
            />
            <Game_item
                room={rooms[2]}
                setChatRoomId={setChatRoomId}
                setFirstCreate={setFirstCreate}
                selectedQuiz={selectedQuiz} setSelectedQuiz={setSelectedQuiz}
                selectedOption_privacy={selectedOption_privacy}
                setPassword={setPassword}
                src={imageSrc[2] ? imageSrc[2] : Thumbnail}
                onClick_private={() => {
                    if (rooms[2].roomId !== null) {
                        setSelectedRoom(rooms[0]);
                        setShowPasswordInput(true);
                        setPassword("");
                        setFirstCreate(false);
                        setSelectedQuiz(rooms[2].quiz);
                        setRoomName(rooms[2].roomName);
                    }
                }}
                onClick_public={handleClick_2}
            />
            <Game_item
                room={rooms[3]}
                setChatRoomId={setChatRoomId}
                setFirstCreate={setFirstCreate}
                selectedQuiz={selectedQuiz} setSelectedQuiz={setSelectedQuiz}
                selectedOption_privacy={selectedOption_privacy}
                setPassword={setPassword}
                src={imageSrc[3] ? imageSrc[3] : Thumbnail}
                onClick_private={() => {
                    if (rooms[3].roomId !== null) {
                        setSelectedRoom(rooms[0]);
                        setShowPasswordInput(true);
                        setPassword("");
                        setFirstCreate(false);
                        setSelectedQuiz(rooms[3].quiz);
                        setRoomName(rooms[3].roomName);
                    }
                }}
                onClick_public={handleClick_3}
            />
            <Game_item
                room={rooms[4]}
                setChatRoomId={setChatRoomId}
                setFirstCreate={setFirstCreate}
                selectedQuiz={selectedQuiz} setSelectedQuiz={setSelectedQuiz}
                selectedOption_privacy={selectedOption_privacy}
                setPassword={setPassword}
                src={imageSrc[4] ? imageSrc[4] : Thumbnail}
                onClick_private={() => {
                    if (rooms[4].roomId !== null) {
                        setSelectedRoom(rooms[0]);
                        setShowPasswordInput(true);
                        setPassword("");
                        setFirstCreate(false);
                        setSelectedQuiz(rooms[4].quiz);
                        setRoomName(rooms[4].roomName);
                    }
                }}
                onClick_public={handleClick_4}
            />
            <Game_item
                room={rooms[5]}
                setChatRoomId={setChatRoomId}
                setFirstCreate={setFirstCreate}
                selectedQuiz={selectedQuiz} setSelectedQuiz={setSelectedQuiz}
                selectedOption_privacy={selectedOption_privacy}
                setPassword={setPassword}
                src={imageSrc[5] ? imageSrc[5] : Thumbnail}
                onClick_private={() => {
                    if (rooms[5].roomId !== null) {
                        setSelectedRoom(rooms[0]);
                        setShowPasswordInput(true);
                        setPassword("");
                        setFirstCreate(false);
                        setSelectedQuiz(rooms[5].quiz);
                        setRoomName(rooms[5].roomName);
                    }
                }}
                onClick_public={handleClick_5}
            />
        </div>
        {showPasswordInput && (
            <div className="overlay">
                <Password_input
                    password={password}
                    setPassword={setPassword}
                    onClose={() => setShowPasswordInput(false)}
                    onConfirm={handleConfirmPassword}
                />
            </div>
        )}
    </div>
}

export default Print_games;