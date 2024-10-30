import '../Quiz/CSS/Room_create_float.css';
import Button from "../Public/Button.jsx";
import {useState} from "react";
import {useAuth} from "../Login/AuthContext.jsx";

function Room_create_float({quiz,onClose}) {
    /* 토큰 */
    const {token} = useAuth();

    const fetchData = async () => {
        const response = await fetch('http://localhost:5000/protected-route', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // JWT 토큰 포함
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            console.error('데이터 요청 실패');
        }
    };
    /* 공개/비공개방 설정 */
    let [privacy,setPrivacy] = useState('public');

    let handleChange = (e) => {
        setPrivacy(e.target.value);
    }

    /* 방 생성 로직 */
    let [roomName, setRoomName] = useState(''); // 방 이름 상태
    let [isPublic, setIsPublic] = useState(true); // 공개 여부 상태
    let [password, setPassword] = useState(''); // 비밀번호 상태
    let [maxPlayer, setMaxPlayer] = useState(0); // 최대 플레이어 수 상태

    let handleRoomNameChange = (e) => {
        setRoomName(e.target.value);
    };

    let handlePublicChange = (e) => {
        setIsPublic(e.target.value === 'public');
    };

    let handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    let handleMaxPlayerChange = (e) => {
        setMaxPlayer(Number(e.target.value));
    };

    // 방 생성 처리
    const handleCreateRoom = async () => {
        const roomData = {
            roomName: roomName,
            publicRoom: isPublic,
            participateAllowed: true, // 참여 허용 여부는 true로 고정
            password: password,
            maxPlayer: maxPlayer,
            quizId: 0, // quizId는 필요에 따라 설정
            userId: 0 // userId는 필요에 따라 설정
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
                console.log('방 생성 성공:', data);
                onClose(); // 방 생성 성공 시 모달 닫기
            } else {
                console.error('Error creating room:', response.statusText);
            }
        } catch (error) {
            console.error('Network error:', error);
        }
    };

    return <div className="Room_create_float">
        <div className="Room_create_setting">
            <div className="set_room_title">
                방 이름 :&nbsp;
                <input
                    className="room_title_input"
                    value={roomName}
                    onChange={handleRoomNameChange}
                />
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
                <select value={maxPlayer} onChange={handleMaxPlayerChange}>
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
                <img src={quiz.thumbnailURL} className="Room_create_img_src"/>
            </div>
            <div className="Room_create_description">
                <div className={"Room_create_description_innerbox"}>
                    {quiz.quizDescription}
                </div>
            </div>
        </div>
        <Button text={"취소"} onClick={onClose} classname={"room_create_cancel"}/>
        <Button text={"확인"} onClick={handleCreateRoom} classname={"room_create_confirm"}/>
    </div>
}

export default Room_create_float;