import './CSS/Print_games.css'
import Game_item from "./Game_item.jsx";

/* 만약 room이 null값이면 출력안하는게 아니라 그만큼 빈자리에 빈 div를 출력함 */
/* Footer 버튼 방 생성 버튼으로 바꾸는거 추가 */
function Print_games() {
    return <div className="Print_games">
        <div className="dash_line"/>
        <div className="games_centerbox">
            <Game_item room={151}/>
            <Game_item room={152}/>
            <Game_item room={153}/>
            <Game_item room={154}/>
            <Game_item room={155}/>
            <Game_item room={156}/>
        </div>
    </div>
}

export default Print_games;