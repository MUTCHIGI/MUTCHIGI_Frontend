import '../Quiz/CSS/Room_create_float.css';
import Button from "../Public/Button.jsx";
import {useEffect, useState} from "react";
import {useAuth} from "../Login/AuthContext.jsx";
import Thumbnail from "../../img/QuizItemTest/test_thumbnail.png";
import {useNavigate} from "react-router-dom";

function Room_create_float({quiz,onClose,userInfo,
                               setChatRoomId,
                               privacy,setPrivacy,
                               roomName,setRoomName,
                               password,setPassword,
                               maxPlayer,setMaxPlayer,
                               setFirstCreate,
                           }) {
    /* 토큰 */
    const {token} = useAuth();

    const navigate = useNavigate();

    /* 방 생성 요소 */

    let handleChange = (e) => {
        setPrivacy(e.target.value);
    }

    let handleRoomNameChange = (e) => {
        setRoomName(e.target.value);
    };

    let handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    let handleMaxPlayerChange = (e) => {
        setMaxPlayer(Number(e.target.value));
    };

    const handleEmptyInputClick = () => {
        alert("방 이름,또는 비공개방의 비밀번호는 비어있을 수 없습니다."); // 비어 있을 때 경고창 출력
    };

    let handleMoveRoom = () => {
        onClose();
        setFirstCreate(true);
        navigate('/ingame');
    }

    return <div className="Room_create_float">
        <div className="Room_create_setting">
            <div className="set_room_title">
                방 이름 :&nbsp;
                <input
                    className="room_title_input"
                    value={roomName}
                    onChange={handleRoomNameChange}
                    placeholder="방 이름 입력"
                />
            </div>
            <div className="set_room_privacy">
                <div className="set_room_privacy_div1">
                    <div className="room_ispublic">
                        공개 :&nbsp;
                        <input
                            type="radio"
                            name="privacy"
                            value="public"
                            checked={privacy === 'public'}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="room_isprivate">
                        비공개 :&nbsp;
                        <input
                            type="radio"
                            name="privacy"
                            value="private"
                            checked={privacy === 'private'}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="room_passwordinput">
                    {privacy === 'private' && <>
                        비밀번호 :&nbsp;
                        <input
                            type="password"
                            className="room_set_password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </>}
                </div>
            </div>
            <div className="set_room_headcount">
                인원 수 :&nbsp;
                <select
                    className="set_headcount"
                    value={maxPlayer}
                    onChange={handleMaxPlayerChange}>
                    <option value={1}>1 명</option>
                    <option value={2}>2 명</option>
                    <option value={3}>3 명</option>
                    <option value={4}>4 명</option>
                    <option value={5}>5 명</option>
                    <option value={6}>6 명</option>
                    <option value={7}>7 명</option>
                    <option value={8}>8 명</option>
                </select>
            </div>
        </div>
        <div className="Room_create_info">
            <div className="Room_create_img">
                {/*<img src={quiz.thumbnailURL} className="Room_create_img_src"/>*/}
            </div>
            <div className="Room_create_description">
                <div className={"Room_create_description_innerbox"}>
                    {/*{quiz.quizDescription}*/}
                </div>
            </div>
        </div>
        <Button text={"취소"} onClick={onClose} classname={"room_create_cancel"}/>

        {(roomName.trim() !== '' && (privacy !== 'private' || password.trim() !== '')) ? (
            <Button text={"확인"} onClick={handleMoveRoom} classname={"room_create_confirm"} />
        ) : (
            <Button text={"확인"} onClick={handleEmptyInputClick} classname={"room_create_confirm_notyet"} />
        )}
    </div>
}

export default Room_create_float;