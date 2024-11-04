import './CSS/Ingame.css';
import Game_board_waiting from "./Game_board_waiting.jsx";
import User from "./User.jsx";
import Button from "../Public/Button.jsx";
import ChatSubmit from "../../img/채팅 전송.png";
import Game_board_playing from "./Game_board_playing.jsx";

import test_profile from '../../img/프로필1.png';

function Ingame() {
    /* Context로 웹소켓 채팅및 이용자들 관리 */
    return <div className="Ingame">
        <div className="left">
            <div className="main_board">
                <Game_board_waiting/>
                {/*<Game_board_playing/>*/}
            </div>
            <div className="user_list">
                <div className="user_box">
                    <User chat={"ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ"} profile_img={test_profile} name={"username1"} number={1} master={true}/>
                    <User chat={"chat chat chat chat chat chat chat"} number={2} name={"username2"}/>
                    <User number={3}/>
                    <User number={4}/>
                    <User number={5}/>
                    <User number={6}/>
                    <User number={7}/>
                    <User number={8}/>
                </div>
            </div>
        </div>
        <div className="right">
            <div className="user_score">
                <div className="user_score_left">
                    <div className="left_box">
                        <div className="name">
                            <span style={{color: 'red'}}>username1</span> : 0
                        </div>
                        <div className="name">
                            <span style={{color: 'orange'}}>username2</span> : 0
                        </div>
                        <div className="name">
                            <span style={{color: 'yellow'}}>username3</span> : 0
                        </div>
                        <div className="name">
                            <span style={{color: 'lightgreen'}}>username4</span> : 0
                        </div>
                    </div>
                </div>
                <div className="user_score_right">
                    <div className="right_box">
                        <div className="name">
                            <span style={{color: 'lightblue'}}>username5</span> : 0
                        </div>
                        <div className="name">
                            <span style={{color: 'magenta'}}>username6</span> : 0
                        </div>
                        <div className="name">
                            <span style={{color: 'mediumpurple'}}>username7</span> : 0
                        </div>
                        <div className="name">
                            <span style={{color: 'ivory'}}>username8</span> : 0
                        </div>
                    </div>
                </div>
            </div>
            <div className="chat">
                <div className="chat_list">
                    <div>

                    </div>
                </div>
                <div className="chat_input_submit">
                    <div className="cis_innerbox">
                        <input className="chat_in"/>
                        <Button classname="chat_submit" logo={ChatSubmit}/>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default Ingame;