import './CSS/Kickmodal.css';
import Button from "../Public/Button.jsx";

function Kickmodal({client,chatRoomId,user,setKickModal,index}) {
    const handleCloseModal = () => {
        setKickModal((prevState) => {
            const newState = [...prevState]; // 배열 복사
            newState[index] = false; // 값 변경
            return newState;
        });
    }

    const kickUser = () => {
        const messageData = {}; // 빈 메시지
        client.current.send(`/app/kickMember/${chatRoomId}/${user.userId}`, {}, JSON.stringify(messageData));
        handleCloseModal();
    }

    return <div className="Kickmodal">
        <div className="Kick_message">
            강퇴하시겠습니까?
        </div>
        <div className="Kickmodal_button">
            <Button text={"확인"} classname="Kick_confirm" onClick={kickUser}/>
            <Button text={"취소"} classname="Kick_cancel" onClick={handleCloseModal}/>
        </div>
    </div>
}

export default Kickmodal;