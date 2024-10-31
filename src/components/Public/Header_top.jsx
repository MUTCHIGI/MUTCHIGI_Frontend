import './CSS/Header_top.css';
import Button from "./Button.jsx";
import Logo from '../../img/mutchigi_logo.png';
import Profile from '../../img/프로필1.png';
import Triangle from '../../img/Polygon 1.png'
import {useContext, useEffect, useRef, useState} from "react";
import {WindowSizeContext} from "../../App.jsx";
import Profile_logout_floating from "./Profile_logout_floating.jsx";
import {useNavigate} from "react-router-dom";

function Header_top() {
    const navigator = useNavigate();
    /* 프로파일 버튼 클릭시 생성되는 플로팅창 */
    const [isDivVisible, setDivVisible] = useState(false); // div 표시 여부를 관리하는 상태
    const divRef = useRef(null); // div의 참조 생성

    // div 외부를 클릭했을 때 div를 숨기는 함수
    const handleClickOutside = (event) => {
        if (divRef.current && !divRef.current.contains(event.target)) {
            setDivVisible(false);
        }
    };

    useEffect(() => {
        // 외부 클릭 이벤트 리스너 추가
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // 컴포넌트 언마운트 시 이벤트 리스너 제거
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="Header">
            <img
                className="logo"
                src={Logo}
                onClick={() => {
                    navigator('/home');
                }}
            />
            <div className="profile_div">
                <img
                    className="profile"
                    src={Profile}
                />
                <Button classname={"profile_logout"} onClick={() => setDivVisible(!isDivVisible)} logo={Triangle}/>
            </div>
            {isDivVisible && (<Profile_logout_floating onclose={() => setDivVisible(false)}/>)}
        </div>
    )
}

export default Header_top;