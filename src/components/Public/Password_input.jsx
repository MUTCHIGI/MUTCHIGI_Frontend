import './CSS/Password_input.css';
import Button from "./Button.jsx";

function Password_input({onClose,onConfirm,
    password,setPassword,
                        }) {
    return <div className="Password_input">
        <div className="password_input_exit">
            <Button text={"X"} classname={"pwd_exit"} onClick={onClose}/>
        </div>
        <div className="password_input_tag">
            비밀번호 :&nbsp;
            <input
                className="pwd_input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 입력"
            />
        </div>
        <div className="password_input_confirm">
            <Button text={"확인"} classname="pwd_input_confirm" onClick={onConfirm}/>
        </div>
    </div>
}

export default Password_input