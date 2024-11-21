import './CSS/Game_stat.css';
import {useEffect} from "react";
import Header_top from "../components/Public/Header_top.jsx";
import Header_bottom from "../components/Public/Header_bottom.jsx";
import Button from "../components/Public/Button.jsx";
import {useNavigate} from "react-router-dom";

function Game_stat({answerCount,setAnswerCount,
    userInfo,setUserInfo,
    setRestartQuizId,setFirstCreate,
}) {
    let navigator = useNavigate();
    const sortedEntries = Object.entries(answerCount).sort(([, valueA], [, valueB]) => valueB - valueA);

    return <div className="Game_stat">
        <Header_top userInfo={userInfo} setUserInfo={setUserInfo} setFirstCreate={setFirstCreate} setRestartQuizId={setRestartQuizId}/>
        <Header_bottom/>
        <div className="stat_board">
            <div className="stat_innerbox">
                {sortedEntries.map(([key, value],index) => (
                    <div key={key} className={`stat_ranking_${index+1}`}>
                        <div className="ranking">
                            {index + 1}등&nbsp;
                        </div>
                        <div className="ranking_username">
                            {key}&nbsp;&nbsp;
                        </div>
                        <div className="ranking_value">
                            {value}
                        </div>
                    </div>
                ))}
            </div>
        </div>
        <div className="stat_board_bottom">
            <Button text={"홈 화면으로"} classname={"stat_gohome"} onClick={() => navigator('/home')}/>
        </div>
    </div>
}

export default Game_stat;