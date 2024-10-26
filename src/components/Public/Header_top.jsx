import './CSS/Header_top.css';
import Button from "./Button.jsx";
import Logo from '../../img/mutchigi_logo.png';
import Profile from '../../img/프로필1.png';
import Triangle from '../../img/Polygon 1.png'
import {useContext, useState} from "react";
import {WindowSizeContext} from "../../App.jsx";

function Header_top() {
    let [activeButton, setActiveButton] = useState(0);

    function handleButtonClick(index) {
        setActiveButton(index);
    }

    return (
        <div className="Header">
            <img
                className="logo"
                src={Logo}
            />
            <div className="profile_div">
                <img
                    className="profile"
                    src={Profile}
                />
                <Button classname={"profile_logout"} logo={Triangle}/>
            </div>

        </div>
    )
}

export default Header_top;