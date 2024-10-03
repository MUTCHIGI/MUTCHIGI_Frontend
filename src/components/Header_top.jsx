import './Header_top.css';
import Button from "./Button.jsx";
import Logo from '../img/mutchigi_logo.png';
import Profile from '../img/프로필1.png';
import Triangle from '../img/Polygon 1.png'
import {useContext, useState} from "react";
import {WindowSizeContext} from "../App.jsx";

function Header_top() {
    let windowSize=useContext(WindowSizeContext);
    document.documentElement.style.setProperty("--root--height",`${windowSize.height}px`);
    document.documentElement.style.setProperty("--root--width",`${windowSize.width}px`);

    let ratio = (((window.innerHeight**2) + (window.innerWidth**2))/4852800)**0.5;
    document.documentElement.style.setProperty("--root--font--ratio",`${ratio}`);

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
            <Button text={"기본"} classname={"mod_default"}/>
            <Button text={"대규모"} classname={"mod_giant"}/>
            <Button text={"멀티플레이"} classname={"mod_multiplay"}/>
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