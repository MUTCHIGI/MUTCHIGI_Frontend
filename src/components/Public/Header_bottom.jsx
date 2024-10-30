import './CSS/Header_bottom.css';
import Button from "./Button.jsx";

function Header_bottom({quiz,customOrplaylist,setCustomOrPlaylist}) {
    return (
        <div className="Header_bottom">
            {quiz && (
                <div className={"Quiz_header_bottom"}>
                    <Button text={"전체"} classname={`mod_all${customOrplaylist===0 ? "_selected" : ""}`} onClick={() => setCustomOrPlaylist(0)}/>
                    <Button text={"기본"} classname={`mod_custom${customOrplaylist===1 ? "_selected" : ""}`} onClick={() => setCustomOrPlaylist(1)}/>
                    <Button text={"플레이리스트"} classname={`mod_playlist${customOrplaylist===2 ? "_selected" : ""}`} onClick={() => setCustomOrPlaylist(2)}/>
                    {customOrplaylist}
                </div>
            )}
        </div>
    )
}

export default Header_bottom;