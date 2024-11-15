import './CSS/Print_games.css'
import Game_item from "./Game_item.jsx";
import {useEffect, useState} from "react";

/* 만약 room이 null값이면 출력안하는게 아니라 그만큼 빈자리에 빈 div를 출력함 */
/* Footer 버튼 방 생성 버튼으로 바꾸는거 추가 */
function Print_games({roomIds,setChatRoomId,setFirstCreate,
    selectedQuiz,setSelectedQuiz,
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
                const response = await fetch(`http://localhost:8080/room/Entities?${queryString}`, {
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

    return <div className="Print_games">
        <div className="dash_line"/>
        <div className="games_centerbox">
            <Game_item room={rooms[0]} setChatRoomId={setChatRoomId} setFirstCreate={setFirstCreate} selectedQuiz={selectedQuiz} setSelectedQuiz={setSelectedQuiz}/>
            <Game_item room={rooms[1]} setChatRoomId={setChatRoomId} setFirstCreate={setFirstCreate} selectedQuiz={selectedQuiz} setSelectedQuiz={setSelectedQuiz}/>
            <Game_item room={rooms[2]} setChatRoomId={setChatRoomId} setFirstCreate={setFirstCreate} selectedQuiz={selectedQuiz} setSelectedQuiz={setSelectedQuiz}/>
            <Game_item room={rooms[3]} setChatRoomId={setChatRoomId} setFirstCreate={setFirstCreate} selectedQuiz={selectedQuiz} setSelectedQuiz={setSelectedQuiz}/>
            <Game_item room={rooms[4]} setChatRoomId={setChatRoomId} setFirstCreate={setFirstCreate} selectedQuiz={selectedQuiz} setSelectedQuiz={setSelectedQuiz}/>
            <Game_item room={rooms[5]} setChatRoomId={setChatRoomId} setFirstCreate={setFirstCreate} selectedQuiz={selectedQuiz} setSelectedQuiz={setSelectedQuiz}/>
        </div>
    </div>
}

export default Print_games;