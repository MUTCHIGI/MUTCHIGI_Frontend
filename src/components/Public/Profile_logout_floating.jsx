import './CSS/Profile_logout_floating.css';
import Button from "./Button.jsx";

function Profile_logout_floating({onclose}) {
    return (
        <div className="Profile_logout_floating">
            <div className="Profile_setting">
                profile setting
            </div>
            <div className="Logout">
                logout
            </div>
            <Button text={"X"} onClick={onclose} classname={"profile_floating_out"}/>
        </div>
    )
}

export default Profile_logout_floating;