import '../InGame/CSS/User.css';
import {useEffect, useState} from "react";
import Kickmodal from "./Kickmodal.jsx";

function User({client,chatRoomId,userInfo,chat,number,master,onClick,index,kickModal,setKickModal}) {
    // chat의 상태를 localChat으로 복사해 사용
    const [localChat, setLocalChat] = useState(chat);
    useEffect(() => {
        if (chat && userInfo.name === chat.username) { // 현재 유저의 채팅이 들어온 경우에만 갱신
            setLocalChat(chat);
            const timer = setTimeout(() => {
                setLocalChat(null); // 3초 후에 chat을 초기화
            }, 3000);
            return () => clearTimeout(timer); // 타이머 정리
        }
    }, [chat, userInfo.name]);

    return <div className="User">
        {localChat && userInfo.name === localChat.username && (
            <>
                <div className="chat_box_body">
                    <div className="inner_box_chat">
                        {localChat.chatMessage}
                    </div>
                </div>
                <div className="chat_box_tail" />
            </>
        )}
        {kickModal[index] && userInfo.userId!==-1 && <Kickmodal client={client} chatRoomId={chatRoomId} user={userInfo} setKickModal={setKickModal} index={index}/>}
        <div className="user_profile">
            {master && (<>
                    <div className="master_div">
                        Master
                    </div>
                </>
            )}
            <div className="profile_image" onClick={onClick}>
                {userInfo.profileImageURL && <img src={userInfo.profileImageURL} className="user_img"/>}
            </div>
            <div className={`profile_name_${number}`}>
                <div className="inner_box_name">
                    {userInfo.name}
                </div>
            </div>
        </div>
    </div>
}

export default User;