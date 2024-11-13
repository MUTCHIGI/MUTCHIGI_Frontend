import './CSS/Game_board_playing.css';
import Button from "../Public/Button.jsx";
import {useNavigate} from "react-router-dom";

function Game_board_playing({stompClient,setFirstCreate,
    quiz,hint

}) {
    let timeout = false;
    let navigate = useNavigate();
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
                room title
            </div>
            <Button text={"exit"} classname={"game_exit"} onClick={handleExit}/>
            <Button text={"share"} classname={"game_share"}/>
        </div>
        <div className="current_div_total">
            cur / total songs
        </div>
        <div className="remaining_time">
            var 초
        </div>
        <div className="playing_skip">
            <div className="play_bar">
                {timeout ? (<div className="current_song_ratio">
                    <div>
                        hello
                    </div>
                </div>) : (<div className="current_answer">
                    정답 : <span className="ans">Current_Answer</span>
                </div>)}
            </div>
            <Button text={"skip!"} classname={"skip"}/>
        </div>
        <div className="hint">
            <div className="hint_1">
                Hint : <span className="hint_bold">type</span> - content
            </div>
            <div className="hint_2">
                Hint : <span className="hint_bold">type</span> - content
            </div>
            <div className="hint_3">
                Hint : <span className="hint_bold">type</span> - content
            </div>
        </div>
        <div className="user_correct">
            <span className="correct_bold">정답자</span> : username1
        </div>
    </div>
}

export default Game_board_playing;