import './CSS/Ingame.css';
import Game_board_waiting from "../components/InGame/Game_board_waiting.jsx";
import User from "../components/InGame/User.jsx";
import Button from "../components/Public/Button.jsx";
import ChatSubmit from "../img/채팅 전송.png";
import Game_board_playing from "../components/InGame/Game_board_playing.jsx";
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import test_profile from '../img/프로필1.png';
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../components/Login/AuthContext.jsx";

function Ingame({quiz,chatRoomId,setChatRoomId,
    privacy,roomName,password,maxPlayer,
    userInfo,
    firstCreate,setFirstCreate,
}) {
    let {token} = useAuth();
    let [qsRelationId,setQsRelationId] = useState(-1);
    const [userList, setUserList] = useState(
        new Array(8).fill({
            userId: -1,
            platformUserId: '',
            email: '',
            name: '',
            profileImageURL: '',
            role: 'Guest',
            provider: { id: 0, providerName: '' }
        })
    );
    const [messageText, setMessageText] = useState(''); // 서버로 전송하는 내 입력 채팅
    const [chatMessages, setChatMessages] = useState([]); // 현재까지의 모든 채팅 내역
    const clientRef = useRef(null); // 소켓 client 저장
    const [superUserId,setSuperUserId] = useState(-1);
    const [timeLimit,setTimeLimit] = useState(0);
    const [gameStart,setGameStart] = useState(false);
    const [songIndex,setSongIndex] = useState(-1);
    const [answer,setAnswer] = useState(null);

    const [answerChat,setAnswerChat] = useState(null);

    const [CurrentQuiz, setCurrentQuiz] = useState(null); // 현재 풀고잇는 퀴즈
    const [CurrentHint,setCurrentHint] = useState(null); // 현재 풀고있는 퀴즈의 힌트

    const socket = new SockJS('http://localhost:8080/room'); //소켓
    const client = Stomp.over(socket); //클라이언트

    const UserCount = userList.filter(user => user.userId !== -1).length;

    useEffect(() => {
        if(firstCreate) {
            handleCreateRoom();
            setFirstCreate(false);
        }
        else {
            connectToRoom(chatRoomId);
        }
    }, []);

    useEffect(() => {
        const fetchUserListAndSuperUser = async () => {
            try {
                // 두 fetch 요청을 병렬로 실행
                const [userListResponse, superUserResponse] = await Promise.all([
                    fetch(`http://localhost:8080/room/userList?roomId=${chatRoomId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }),
                    fetch(`http://localhost:8080/room/superUser?roomId=${chatRoomId}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    }),
                ]);

                // 두 응답을 각각 처리
                if (userListResponse.ok) {
                    const users = await userListResponse.json();
                    const updatedUserList = [...users];
                    while (updatedUserList.length < 8) {
                        updatedUserList.push({
                            userId: -1,
                            platformUserId: '',
                            email: '',
                            name: '',
                            profileImageURL: '',
                            role: 'Guest',
                            provider: { id: 0, providerName: '' }
                        });
                    }
                    setUserList(updatedUserList);
                } else {
                    console.error('Failed to fetch user list');
                }

                if (superUserResponse.ok) {
                    const superUserId = await superUserResponse.json();
                    setSuperUserId(superUserId); // 방장 ID 상태 설정
                } else {
                    console.error('Failed to fetch super user');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // 채팅 메시지가 업데이트될 때마다 유저 목록을 새로 조회
        if (chatMessages.length > 0) {
            fetchUserListAndSuperUser();
        }
    }, [chatMessages, token, chatRoomId]);

    // 방 생성 처리 < 이거 ingame으로 옮기기
    const handleCreateRoom = async () => {
        let isPublic = privacy === 'public';
        const roomData = {
            roomName: roomName,
            publicRoom: isPublic,
            participateAllowed: true, // 참여 허용 여부는 true로 고정
            password: password,
            maxPlayer: maxPlayer,
            quizId: quiz.quizId, // quizId는 필요에 따라 설정
            userId: userInfo.userId// userId는 필요에 따라 설정
        };

        try {
            const response = await fetch('http://localhost:8080/room/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(roomData),
            });

            if (response.ok) {
                const data = await response.json();
                setChatRoomId(data); // ChatRoomId state에 만들어진 방 id 저장
                connectToRoom(data);
            } else {
                console.error('Error creating room:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    const connectToRoom = (chatRoomId) => {
        client.connect(
            {
            'Authorization': 'Bearer ' + token,
        }, (frame) => {
            subscribe(client,chatRoomId,userInfo.userId);
            const joinRoomData = {
                roomId: chatRoomId,
                roomPassword: password
            };
            client.send(`/app/joinRoom/${chatRoomId}`, {}, JSON.stringify(joinRoomData));
        }, (error) => {
            console.error("STOMP 연결 실패:", error);  // 연결 실패 시 오류 로그 추가
        });
        clientRef.current=client;
    };

    // 외부에 정의된 subscribe 함수
    function subscribe(stompClient, roomId, chatUserId) {
        stompClient.subscribe('/topic/' + roomId, (message) => {
            const parsedMessage = JSON.parse(message.body);
            const newMessage = {
                username: parsedMessage.userName,
                chatMessage: parsedMessage.chatMessage,
            };

            setChatMessages((prevMessages) => [...prevMessages, newMessage]);
        });

        // chatRoomId에 해당하는 구독 생성
        stompClient.subscribe('/topic/song/' + roomId, (message) => {
            const received_quiz = JSON.parse(message.body);
            setCurrentQuiz(received_quiz); // 응답 메시지 데이터를 CurrentQuiz state에 저장
            setQsRelationId(received_quiz.qsRelationId);

            stompClient.send(
                `/app/getHint/${roomId}/${received_quiz.qsRelationId}`,
                {}, // headers, 필요시 설정
                JSON.stringify({}) // 메시지 본문이 필요 없으므로 빈 객체
            );
        });
        stompClient.subscribe('/topic/vote/' + roomId);

        stompClient.subscribe('/topic/hint/' + roomId, (message) => {
            const received_Hint = JSON.parse(message.body);
            setCurrentHint(received_Hint);
        });
        stompClient.subscribe('/topic/correct/' + roomId, (message) => {
            const received_answerChat = JSON.parse(message.body);
            setAnswerChat(received_answerChat);
        });
        stompClient.subscribe('/topic/kick/' + roomId);
        stompClient.subscribe('/topic/superUser/' + roomId);

        // 오류 메시지 수신 구독
        stompClient.subscribe('/userDisconnect/' + chatUserId + '/queue/errors', (message) => {
            console.log("Received error message:", message.body);
            alert(message.body);

            if (message.body === "INVALID_PASSWORD") {
                alert("비밀번호가 틀렸습니다. 연결을 종료합니다.");
                stompClient.disconnect(); // STOMP 연결 종료
            }
            if (message.body === "ROOM_NOT_FOUND") {
                alert("해당 방이 존재하지 않습니다. 연결을 종료합니다.");
                stompClient.disconnect(); // STOMP 연결 종료
            }
            if (message.body === "KICKED_FROM_SERVER") {
                alert("방장에 의해 강제퇴장되었습니다. 연결을 종료합니다.");
                stompClient.disconnect();
            }
        });
    }

    // 메시지 전송 함수
    const sendMessage = () => {
        if (!messageText.trim()) return; // 빈 메시지 체크

        const sendMessageData = {
            chatMessage: messageText,
            qsRelationId: qsRelationId, // 기본값 -1 설정
        };

        clientRef.current.send(`/app/send/${chatRoomId}`, {}, JSON.stringify(sendMessageData));
        setMessageText(''); // 메시지 전송 후 입력 필드 초기화
    };

    // 현재 index 퀴즈 불러오기
    useEffect(() => {
        if (songIndex !== null && clientRef.current && clientRef.current.connected) {
            // songIndex가 변경될 때마다 웹소켓을 통해 메시지를 보냄
            clientRef.current.send(
                `/app/getSong/${chatRoomId}/${songIndex}`,
                {}, // headers가 필요하면 추가
                JSON.stringify({}) // 메시지 본문이 필요 없을 경우 빈 객체로 전달
            );
        }
    }, [songIndex]);

    // 엔터키 또는 버튼 클릭으로 메시지 전송하기
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
        }
    };

    const chatListRef = useRef(null); // chat_list div를 참조하는 Ref

    // 정답 호출
    useEffect(() => {
        if (qsRelationId!==-1) {
            const fetchAnswer = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/song/youtube/${qsRelationId}/answers`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }

                    const data = await response.json();
                    setAnswer(data); // 응답 데이터를 answer state에 저장
                } catch (error) {
                    console.error("Error fetching answer:", error);
                }
            };
            fetchAnswer();
        }
    }, [qsRelationId]);

    // 힌트 호출
    useEffect(() => {
        // qsRelationId가 -1이 아니면 GET 요청을 보냄
        if (qsRelationId !== -1) {
            const fetchHint = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/song/youtube/${qsRelationId}/hint`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const hintData = await response.json();
                        setCurrentHint(hintData); // currentHint state에 데이터 저장
                    } else {
                        console.error('Hint 요청 실패:', response.status);
                    }
                } catch (error) {
                    console.error('오류 발생:', error);
                }
            };
            fetchHint();
        }
    }, [qsRelationId]); // qsRelationId가 변경될 때마다 실행

    useEffect(() => {
        if (chatListRef.current) {
            // chat_list div가 존재하면 스크롤을 맨 아래로 이동
            chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
        }
    }, [chatMessages]); // chatMessages가 변경될 때마다 실행

    return <div className="Ingame">
        <div className="left">
            <div className="main_board">
                {!gameStart ?
                    <Game_board_waiting
                        stopmClient={client}
                        setFirstCreate={setFirstCreate}
                        qsRelationId={qsRelationId}
                        setSongIndex={setSongIndex}
                        songIndex={songIndex}
                        roomName={roomName}
                        master={userInfo.userId===superUserId}
                        UserCount={UserCount}
                        setGameStart={setGameStart}
                    /> :
                    <Game_board_playing
                        stompClient={client}
                        setFirstCreate={setFirstCreate}
                        quiz={CurrentQuiz}
                        hint={CurrentHint}
                        timelimit={quiz.songPlayTime}
                        roomName={roomName}
                        songIndex={songIndex}
                        setSongIndex={setSongIndex}
                        songCount={quiz.songCount}
                        answer={answer}
                        answerChat={answerChat}
                        setAnswerChat={setAnswerChat}
                    />
                }
            </div>
            <div className="user_list">
                <div className="user_box">
                    <User userInfo={userList[0]} chat={chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : null} number={1} master={userList[0].userId===superUserId}/>
                    <User userInfo={userList[1]} chat={chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : null} number={2} master={userList[1].userId===superUserId}/>
                    <User userInfo={userList[2]} chat={chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : null} number={3} master={userList[2].userId===superUserId}/>
                    <User userInfo={userList[3]} chat={chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : null} number={4} master={userList[3].userId===superUserId}/>
                    <User userInfo={userList[4]} chat={chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : null} number={5} master={userList[4].userId===superUserId}/>
                    <User userInfo={userList[5]} chat={chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : null} number={6} master={userList[5].userId===superUserId}/>
                    <User userInfo={userList[6]} chat={chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : null} number={7} master={userList[6].userId===superUserId}/>
                    <User userInfo={userList[7]} chat={chatMessages.length > 0 ? chatMessages[chatMessages.length - 1] : null} number={8} master={userList[7].userId===superUserId}/>
                </div>
            </div>
        </div>
        <div className="right">
            <div className="user_score">
                <div className="user_score_left">
                    <div className="left_box">
                        <div className="name">
                            {userList[0].userId !== -1
                            &&
                                <>
                                    <span style={{color: 'red'}}>{userList[0].name}</span> : 0
                                </>
                            }
                        </div>
                        <div className="name">
                            {userList[1].userId !== -1
                                &&
                                <>
                                    <span style={{color: 'red'}}>{userList[1].name}</span> : 0
                                </>
                            }
                        </div>
                        <div className="name">
                            {userList[2].userId !== -1
                                &&
                                <>
                                    <span style={{color: 'red'}}>{userList[2].name}</span> : 0
                                </>
                            }
                        </div>
                        <div className="name">
                            {userList[3].userId !== -1
                                &&
                                <>
                                    <span style={{color: 'red'}}>{userList[3].name}</span> : 0
                                </>
                            }
                        </div>
                    </div>
                </div>
                <div className="user_score_right">
                    <div className="right_box">
                        <div className="name">
                            {userList[4].userId !== -1
                                &&
                                <>
                                    <span style={{color: 'red'}}>{userList[4].name}</span> : 0
                                </>
                            }
                        </div>
                        <div className="name">
                            {userList[5].userId !== -1
                                &&
                                <>
                                    <span style={{color: 'red'}}>{userList[5].name}</span> : 0
                                </>
                            }
                        </div>
                        <div className="name">
                            {userList[6].userId !== -1
                                &&
                                <>
                                    <span style={{color: 'red'}}>{userList[6].name}</span> : 0
                                </>
                            }
                        </div>
                        <div className="name">
                            {userList[7].userId !== -1
                                &&
                                <>
                                    <span style={{color: 'red'}}>{userList[7].name}</span> : 0
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="chat">
                <div className="chat_list" ref={chatListRef}>
                    {chatMessages.map((msg, index) => (
                        <div key={index} className={msg.username === userInfo.name ? 'my_chat' : 'other_chat'}>
                            {msg.username === userInfo.name ?
                                <>
                                    {msg.chatMessage}
                                </> :
                                <>
                                    <span style={{
                                        color: 'white',
                                        fontWeight : 'bold'
                                    }}>{msg.username}</span> : {msg.chatMessage}
                                </>}
                        </div>
                    ))}
                </div>
                <div className="chat_input_submit">
                    <div className="cis_innerbox">
                        <input
                            className="chat_in"
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                        <Button
                            classname="chat_submit"
                            logo={ChatSubmit}
                            onClick={sendMessage}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Ingame;