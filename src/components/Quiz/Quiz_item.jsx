import './CSS/Quiz_item.css';
import Logo from '../../img/Yt_logo.png';

function Quiz_item({quizId,quiz_title,quiz_description,Thumbnail,onClick}) {
    let allPropsProvided = quizId !== null;
    let displayDescription="";

    if(allPropsProvided) {
        if(quiz_description.length>=132) {
            displayDescription = quiz_description.slice(0,132) + '...';
        }
        else {
            displayDescription=quiz_description;
        }
    }
    return <div className="Quiz_item">
        <div>
            {allPropsProvided ? (<>
                    <div className="Quiz_item_provided" onClick={onClick}>
                        <div>
                            <img src={Thumbnail} className="quiz_thumbnail"/>
                            <img src={Logo} className="platform_logo"/>
                        </div>
                        <div className="quiz_title">
                            {quiz_title}
                        </div>
                        <div className="quiz_description">
                            {displayDescription}
                        </div>
                    </div>
                </>
            ) : (
                <div/>
            )}

        </div>
    </div>
}

export default Quiz_item;