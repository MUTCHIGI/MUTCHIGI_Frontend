import '../InGame/CSS/User.css';

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
            {master && (<>
                    <div className={"master_div"}>
                        Master
                    </div>
                </>
            )}
            <div className="profile_image">
                <img src={profile_img} className="user_img"/>
            </div>
            <div className={`profile_name_${number}`}>
                <div className="inner_box_name">
                    {name}
                </div>
            </div>
        </div>
    </div>
}

export default User;