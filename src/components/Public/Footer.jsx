import './CSS/Footer.css';
import Button from "./Button.jsx";

function Footer() {
    return <div className="Footer">
        <div className="page_offset">
            <Button text={"<"} classname={"page_left"}/>
            <div className="cur_page">
                3
            </div>
            <Button text={">"} classname={"page_right"}/>
            <input className="input_page" type="number" />
            <Button text={"이동"} classname={"page_move"}/>
        </div>
        <Button text={"방 만들기"} classname={"create_room"}/>
    </div>
}

export default Footer;