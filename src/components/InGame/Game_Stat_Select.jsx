import './CSS/Game_stat_select.css';

function Game_stat_select({selected,setSelected}) {
    const handleClick = (state) => {
        setSelected(state);
    }

    return <div className="Game_stat_select">
        <div
            className={selected==='select1' ? "stat_select_on1" : "stat_select1"}
            onClick={() => handleClick('select1')}
        >
            Score
        </div>
        <div
            className={selected==='select2' ? "stat_select_on2" : "stat_select2"}
            onClick={() => handleClick('select2')}
        >
            Quiz
        </div>
        <div
            className={selected==='select3' ? "stat_select_on3" : "stat_select3"}
            onClick={() => handleClick('select3')}
        >
            Detail
        </div>
    </div>
}

export default Game_stat_select;