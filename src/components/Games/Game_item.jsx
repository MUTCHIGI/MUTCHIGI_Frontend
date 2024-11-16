import './CSS/Game_item.css';
import Thumbnail from '../../img/QuizItemTest/no_img.png';
import Platform from '../../img/GameitemTest/Yt_logo.png';
import Public from '../../img/GameitemTest/잠금 해제.png';
import Private from '../../img/GameitemTest/잠금.png';
import {useNavigate} from "react-router-dom";
import {useAuth} from "../Login/AuthContext.jsx";
import {useEffect, useState} from "react";

function Game_item({room,setChatRoomId,setFirstCreate,
    selectedQuiz,setSelectedQuiz,selectedOption_privacy,
    setPassword,onClick_public,onClick_private
                   }) {
    let mod;
    let type;
    let wait_play;
    let {token} = useAuth();
    const [imageSrc,setImageSrc] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await fetch(`/quiz/images/${room.thumbnailURL}`);
                if (response.ok) {
                    const data = await response.blob();
                    // Blob URL을 생성하여 반환
                    const image = URL.createObjectURL(data);
                } else {
                    console.error("Failed to fetch image:", response.status);
                }
            } catch (error) {
                console.error("Error fetching image:", error);
                return ""; // 오류 발생시 빈 문자열 반환
            }
        };

        fetchImage();
    }, []);

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

    return <div className="Game_item" onClick={selectedOption_privacy ? onClick_public : onClick_private}>
        {room.roomId !== null && <>
            <img src={imageSrc} className="Thumbnail"/>
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
                    {room.maxPlayer}
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