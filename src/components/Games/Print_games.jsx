import './CSS/Print_games.css'
import Game_item from "./Game_item.jsx";
import {useEffect, useState} from "react";

/* 만약 room이 null값이면 출력안하는게 아니라 그만큼 빈자리에 빈 div를 출력함 */
/* Footer 버튼 방 생성 버튼으로 바꾸는거 추가 */
function Print_games({roomIds}) {
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
    const fetchRoomEntities = async () => {
        // roomIds가 빈 배열인경우?
        if(roomIds.length === 0) {
            return;
        }

        // URLSearchParams로 쿼리 파라미터 생성
        const params = new URLSearchParams();
        roomIds.forEach(id => params.append('roomIds', id));

        try {
            const response = await fetch(`http://localhost:8080/room/Entities?${params.toString()}`);

            // 응답이 성공적인지 확인
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            // JSON 형식으로 응답 데이터 파싱
            const data = await response.json();

            // rooms의 크기를 6으로 맞추는 로직
            const adjustedRooms = [...data];

            while (adjustedRooms.length < 6) {
                adjustedRooms.push(emptyRoomTemplate);
            }

            // 데이터를 rooms 상태에 저장
            setRooms(adjustedRooms);
        } catch (error) {
            console.error('Failed to fetch room entities:', error);
        }
    };

    useEffect(() => {
        fetchRoomEntities();
    }, [roomIds]);


    return <div className="Print_games">
        <div className="dash_line"/>
        <div className="games_centerbox">
            <Game_item room={rooms[0]}/>
            <Game_item room={rooms[1]}/>
            <Game_item room={rooms[2]}/>
            <Game_item room={rooms[3]}/>
            <Game_item room={rooms[4]}/>
            <Game_item room={rooms[5]}/>
        </div>
    </div>
}

export default Print_games;