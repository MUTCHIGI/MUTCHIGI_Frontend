import './CSS/Profile_logout_floating.css';
import Button from "./Button.jsx";
import Logout from "../../img/로그아웃.png"
import {useEffect, useRef} from "react";

function Profile_logout_floating({onclose,setToken,setDivVisible}) {
    const handleLogout = () => {
        setToken(null); // 상태에서 토큰 삭제
        setDivVisible(false);
        localStorage.removeItem('jwtToken'); // 로컬 스토리지에서 토큰 삭제
    };

    // div 외부 클릭시 닫힘
    const ref = useRef();
    useEffect(() => {
        // 컴포넌트 밖의 클릭을 감지하는 함수
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                onclose(); // 컴포넌트를 닫는 함수 호출
            }
        };

        // 마우스 클릭 이벤트 리스너 추가
        document.addEventListener('mousedown', handleClickOutside);

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onclose]);

    return (
        <div ref={ref} className="Profile_logout_floating">
            <div className="Logout" onClick={handleLogout}>
                Logout
                <img src={Logout} className="Logout_img"/>
            </div>
            <div className="Profile_setting">
                quiz_notification
            </div>
        </div>
    )
}

export default Profile_logout_floating;