import './CSS/Game_board_waiting.css';
import Button from "../Public/Button.jsx";
import {useNavigate} from "react-router-dom";

function Game_board_waiting({stompClient,setFirstCreate,roomName,master}) {
    const navigate = useNavigate();

    const handleExit = () => {
        // 방과의 연결 해제
        if (stompClient && stompClient.connected) {
            stompClient.disconnect(() => {
                console.log("Disconnected from room");
            });
        }
        // /home 경로로 이동
        setFirstCreate(true);
        navigate('/home');
        window.location.reload();
    };
    return <div className="Game_board_waiting">
        <div className="title_exit_share">
            <div className="game_board_title">
                {roomName}
            </div>
            <Button text={"exit"} classname={"game_exit"} onClick={handleExit}/>
            <Button text={"share"} classname={"game_share"}/>
        </div>
        <div className="ready_box">
            {!master ?
                <Button text={"Ready!"} classname={"game_ready"}/> :
                <Button text={"Start!"} classname={"game_ready"}/>
            }

        </div>
        <div className="ready_proportion">
            current / total Ready
        </div>
    </div>
}

export default Game_board_waiting;