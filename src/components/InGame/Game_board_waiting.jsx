import './CSS/Game_board_waiting.css';
import Button from "../Public/Button.jsx";

function Game_board_waiting() {
    return <div className="Game_board_waiting">
        <div className="title_exit_share">
            <div className="game_board_title">
                room title
            </div>
            <Button text={"exit"} classname={"game_exit"}/>
            <Button text={"share"} classname={"game_share"}/>
        </div>
        <div className="ready_box">
            <Button text={"Ready!"} classname={"game_ready"}/>
        </div>
        <div className="ready_proportion">
            current / total Ready
        </div>
    </div>
}

export default Game_board_waiting;