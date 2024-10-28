import './CSS/Print_quiz.css';
import Quiz_item from "./Quiz_item.jsx";
import Button from "../Public/Button.jsx";
import Yt_logo from "../../img/Yt_logo.png"
import Thumbnail from '../../img/QuizItemTest/test_thumbnail.png';
import Logo from '../../img/Yt_logo.png';
import {useState} from "react";
import Room_create_float from "./Room_create_float.jsx";


function Print_quiz() {

    let quiz_MockData_1 ={
        Thumbnail,
        Logo,
        quiz_title : "quiz_title_1",
        quiz_description : "" +
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    };

    /* 방을 생성하기 위한 핸들러 */
    let [showFloat,setShowFloat] = useState(false);

    let handleShowFloat = () => {
        setShowFloat(true);
        console.log("good!");
    }

    let handleCloseFloat = () => {
        setShowFloat(false);
    }

    return <div className="PrintQuizList">
        <div className="select_button">
            <Button text={"All"} classname={"quiz_platform_all"}/>
            <Button logo={Yt_logo} classname={"quiz_platform_youtube"}/>
        </div>
        <div className="quiz_centerbox">
            <Quiz_item {...quiz_MockData_1} onClick={handleShowFloat}/>
            <Quiz_item/>
            <Quiz_item/>
            <Quiz_item/>
            <Quiz_item/>
            <Quiz_item/>
            <Quiz_item/>
            <div className="create_new_quiz">
                <div className="new_quiz_plus">
                    +
                </div>
                <div className="new_quiz_text">
                    퀴즈 만들기
                </div>
            </div>
        </div>
        {showFloat && <Room_create_float onClose={handleCloseFloat}/>}
    </div>
}

export default Print_quiz;