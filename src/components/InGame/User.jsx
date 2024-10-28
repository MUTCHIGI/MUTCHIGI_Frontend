import '../InGame/CSS/User.css';
import Master from '../../img/room_master.png';

function User({id,name,profile_img,chat,number,master,ready}) {
    return <div className="User">
        {chat!=="" && chat && (
            <>
                <div className="chat_box_body">
                    <div className="inner_box_chat">
                        {chat}
                    </div>
                </div>
                <div className="chat_box_tail"/>
            </>
        )}
        <div className="user_profile">
            <div className="profile_image">
                <img src={profile_img} className="user_img"/>
            </div>
            <div className={`profile_name_${number}`}>
                    {master && (<>
                    <div className={"img_master_div"}>
                        <img src={Master} className="img_master"/>
                    </div>
                    </>
                    )}
                <div className="inner_box_name">
                    {name}
                </div>
            </div>
        </div>
    </div>
}

export default User;