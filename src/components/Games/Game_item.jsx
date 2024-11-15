import './CSS/Game_item.css';
import Thumbnail from '../../img/GameitemTest/test_thumbnail.png';
import Platform from '../../img/GameitemTest/Yt_logo.png';
import Public from '../../img/GameitemTest/잠금 해제.png';
import Private from '../../img/GameitemTest/잠금.png';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../Login/AuthContext.jsx";

function Game_item({room,setChatRoomId,setFirstCreate,
    selectedQuiz,setSelectedQuiz,
                   }) {
    let mod;
    let type;
    let wait_play;
    let {token} = useAuth();

    const navigate = useNavigate();

    const handleClick = async () => {
        if (room.roomId !== null) {  // room.id가 null이 아닐 때
            try {
                const response = await fetch(`http://localhost:8080/room/Entities?idList=${room.roomId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (response.ok) {
                    const data = await response.json();

                    // participateAllowed가 true일 경우에만 실행
                    if (data[0].participateAllowed) {
                        setChatRoomId(room.roomId);
                        setFirstCreate(false);
                        setSelectedQuiz(room.quiz);
                        navigate('/ingame');  // '/ingame'으로 네비게이션
                    } else {
                        window.alert('이미 게임이 시작되었거나 인원이 꽉 찼습니다');
                        navigate('/home');
                    }
                } else {
                    console.error('데이터를 가져오는 데 실패했습니다.');
                }
            } catch (error) {
                console.error('GET 요청 중 오류 발생:', error);
            }
        }
    };

    if(room.roomId !== null) {
        switch (room.quiz.modId) {
            case 1:
                mod = "커스텀";
                break;
            case 2:
                mod = "플레이리스트";
                break;
            default:
                mod = "undefined";
        }

        switch (room.quiz.typeId) {
            case 1:
                type = "(Default)";
                break;
            case 2:
                type = "(Instrumental Only)";
                break;
            default:
                type = "undefined";
        }

        switch (room.participateAllowed) {
            case true:
                wait_play = "waiting";
                break;
            case false:
                wait_play = "playing";
                break;
            default:
                wait_play = "undefined";
        }
    }

    return <div className="Game_item" onClick={room.id !== null ? handleClick : undefined}>
        {room.roomId !== null && <>
            <img src={room.thumbnailURL} className="Thumbnail"/>
            <img src={Platform} className="Platform"/>
            <div className="room_number">
                {room.roomId}
            </div>
            <div className={room.participateAllowed ? "room_information_1_waiting" : "room_information_1_playing"}>
                <div className="room_info1_top"/>
                <div className="room_info1_mid">
                    <div className="mod">
                        {mod}
                    </div>
                    <div className="type">
                        {type}
                    </div>
                </div>
                <div className="room_info1_bottom">
                    <div className="wait_play">
                        {wait_play}
                    </div>
                </div>
            </div>
            <div className="room_information_2">
                <div className="room_info2_top">

                </div>
                <div className="room_info2_mid">
                    3 / {room.maxPlayer}
                </div>
                <div className="room_info2_bottom">
                    <img src={room.publicRoom ? Public : Private} className="public_or_private"/>
                </div>
            </div>
            <div className="room_information_title">
                {room.roomName}
            </div>
        </>}
    </div>
}

export default Game_item;