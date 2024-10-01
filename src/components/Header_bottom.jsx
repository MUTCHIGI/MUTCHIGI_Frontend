import './Header_bottom.css';
import Button from "./Button.jsx";

function Header_bottom() {
    return (
        <div className="Header_bottom">
            <Button text={"커스텀"} classname={"mod_custom"}/>
            <Button text={"추천"} classname={"mod_recommend"}/>
            <Button text={"플레이리스트"} classname={"mod_playlist"}/>
            <Button text={"AI악기분리"} classname={"mod_ai_generate"}/>
        </div>
    )
}

export default Header_bottom;