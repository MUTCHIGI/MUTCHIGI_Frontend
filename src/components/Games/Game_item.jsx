import './CSS/Game_item.css';
import Thumbnail from '../../img/GameitemTest/test_thumbnail.png';
import Platform from '../../img/GameitemTest/Yt_logo.png';
import Public from '../../img/GameitemTest/잠금.png';
import Private from '../../img/GameitemTest/잠금 해제.png';

function Game_item({room}) {
    return <div className="Game_item">
        <img src={Thumbnail} className="Thumbnail"/>
        <img src={Platform} className="Platform"/>
        <div className="room_number">
            {room}
        </div>
        <div className="room_information_1">
            <div className="room_info1_top">

            </div>
            <div className="room_info1_mid">
                <div className="mod">
                    플레이리스트
                </div>
            </div>
            <div className="room_info1_bottom">
                <div className="wait_or_play">
                    waiting
                </div>
            </div>
        </div>
        <div className="room_information_2">
            <div className="room_info2_top">

            </div>
            <div className="room_info2_mid">
                3 / 8
            </div>
            <div className="room_info2_bottom">
                <img src={Public} className="public_or_private"/>
            </div>
        </div>
        <div className="room_information_title">
            Title_1
        </div>
    </div>
}

export default Game_item;