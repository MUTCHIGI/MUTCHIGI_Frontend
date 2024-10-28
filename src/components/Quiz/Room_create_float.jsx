import '../Quiz/CSS/Room_create_float.css';
import Button from "../Public/Button.jsx";
import {useState} from "react";

function Room_create_float({onClose}) {
    /* 공개/비공개방 설정 */
    let [privacy,setPrivacy] = useState('public');

    let handleChange = (e) => {
        setPrivacy(e.target.value);
    }
    return <div className="Room_create_float">
        <div className="Room_create_setting">
            <div className="set_room_title">
                방 이름 :&nbsp;
                <input className="room_title_input"/>
            </div>
            <div className="set_room_privacy">
                <div>
                    공개 :&nbsp;
                    <input
                        type="radio"
                        name="privacy"
                        value="public"
                        checked={privacy === 'public'}
                        onChange={handleChange}
                    />
                </div>
                <div>
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
            <div className="set_room_headcount">
                <select>
                    <option>1 명</option>
                    <option>2 명</option>
                    <option>3 명</option>
                    <option>4 명</option>
                    <option>5 명</option>
                    <option>6 명</option>
                    <option>7 명</option>
                    <option>8 명</option>
                </select>
            </div>
        </div>
        <div className="Room_create_info">
            <div className="Room_create_img">
                img
            </div>
            <div className="Room_create_description">
                <div className={"Room_create_description_innerbox"}>
                    description
                </div>
            </div>
        </div>
        <Button text={"취소"} onClick={onClose} classname={"room_create_cancel"}/>
        <Button text={"확인"} classname={"room_create_confirm"}/>
    </div>
}

export default Room_create_float;