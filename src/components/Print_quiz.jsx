import './Print_quiz.css';
import Quiz_item from "./Quiz_item.jsx";
import Button from "./Button.jsx";
import Yt_logo from "../img/Yt_logo.png"
import Thumbnail from '../img/QuizItemTest/test_thumbnail.png';
import Logo from '../img/Yt_logo.png';


function Print_quiz() {

    let quiz_MockData_1 ={
        Thumbnail,
        Logo,
        quiz_title : "quiz_title_1",
        quiz_description : "" +
            "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
    };

    return <div className="PrintQuizList">
        <div className="select_button">
            <Button text={"All"} classname={"quiz_platform_all"}/>
            <Button logo={Yt_logo} classname={"quiz_platform_youtube"}/>
        </div>
        <div className="quiz_centerbox">
            <Quiz_item {...quiz_MockData_1}/>
            <Quiz_item/>
            <Quiz_item/>
            <Quiz_item/>
            <Quiz_item/>
            <Quiz_item/>
            <Quiz_item/>
            <Quiz_item/>
        </div>
    </div>
}

export default Print_quiz;