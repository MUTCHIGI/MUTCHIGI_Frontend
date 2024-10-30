import './CSS/Print_quiz.css';
import Quiz_item from "./Quiz_item.jsx";
import Button from "../Public/Button.jsx";
import Yt_logo from "../../img/Yt_logo.png"
import Thumbnail from '../../img/QuizItemTest/test_thumbnail.png';
import Logo from '../../img/Yt_logo.png';
import {useEffect, useState} from "react";
import Room_create_float from "./Room_create_float.jsx";
import {useAuth} from "../Login/AuthContext.jsx";


function Print_quiz({quizIds}) {
    let {token} = useAuth();

    // 빈 퀴즈 객체 정의
    const emptyQuiz = {
        quizId: 1,
        songCount: 0,
        quizName: "빈 퀴즈",
        quizDescription: "설명이 없습니다.",
        releaseDate: "2024-10-30",
        userPlayCount: 0,
        typeId: 0,
        modId: 0,
        hintCount: 0,
        songPlayTime: {
            hour: 0,
            minute: 0,
            second: 0,
            nano: 0,
        },
        thumbnailURL: "https://via.placeholder.com/150",
        instrumentId: 0,
        user: {
            userId: 0,
            platformUserId: "string",
            email: "string",
            name: "string",
            profileImageURL: "string",
            role: "Admin",
            provider: {
                id: 0,
                providerName: "string",
            },
        },
        useDisAlg: true,
    };

    const [quizzes, setQuizzes] = useState(Array.from({ length: 7 }, () => ({ ...emptyQuiz })));

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                // quizIds가 비어있지 않은 경우에만 요청을 보냅니다.
                if (quizIds.length === 0) return;


                // quizIds를 요청 파라미터로 사용하여 요청 URL 구성
                const responses = await Promise.all(
                    quizIds.map(async (quizId) => {
                        const response = await fetch(`http://localhost:8080/quiz/Entities?quizId=${quizId}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${token}`, // 필요하다면 토큰도 포함
                            },
                        });

                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }

                        return await response.json();
                    })
                );

                // 7개 미만인 경우 빈 퀴즈 객체를 추가
                const filledQuizzes = [...responses];
                while (filledQuizzes.length < 7) {
                    filledQuizzes.push(emptyQuiz);
                }

                setQuizzes(filledQuizzes); // 성공적으로 받아온 데이터 저장
            } catch (error) {
                console.error('Failed to fetch quiz entities:', error);
            }
        };

        fetchQuizzes();
    }, [quizIds]);

    /* 방을 생성하기 위한 핸들러 */
    let [showFloat,setShowFloat] = useState(false);
    const [selectedQuiz, setSelectedQuiz] = useState(null); // 선택된 퀴즈 상태 추가

    let handleShowFloat = (quiz) => {
        setSelectedQuiz(quiz);
        setShowFloat(true);
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
            <Quiz_item
                quizId={quizzes[0].quizId}
                quiz_title={quizzes[0].quizName}
                quiz_description={quizzes[0].quizDescription}
                Thumbnail={quizzes[0].thumbnailURL}
                onClick={() => handleShowFloat(quizzes[0])} // 클릭 시 quizzes[0] 정보를 전달
            />
            <Quiz_item
                quizId={quizzes[1].quizId}
                quiz_title={quizzes[1].quizName}
                quiz_description={quizzes[1].quizDescription}
                Thumbnail={quizzes[1].thumbnailURL}
                onClick={() => handleShowFloat(quizzes[1])} // 클릭 시 quizzes[0] 정보를 전달
            />
            <Quiz_item
                quizId={quizzes[2].quizId}
                quiz_title={quizzes[2].quizName}
                quiz_description={quizzes[2].quizDescription}
                Thumbnail={quizzes[2].thumbnailURL}
                onClick={() => handleShowFloat(quizzes[2])} // 클릭 시 quizzes[0] 정보를 전달
            />
            <Quiz_item
                quizId={quizzes[3].quizId}
                quiz_title={quizzes[3].quizName}
                quiz_description={quizzes[3].quizDescription}
                Thumbnail={quizzes[3].thumbnailURL}
                onClick={() => handleShowFloat(quizzes[3])} // 클릭 시 quizzes[0] 정보를 전달
            />
            <Quiz_item
                quizId={quizzes[4].quizId}
                quiz_title={quizzes[4].quizName}
                quiz_description={quizzes[4].quizDescription}
                Thumbnail={quizzes[4].thumbnailURL}
                onClick={() => handleShowFloat(quizzes[4])} // 클릭 시 quizzes[0] 정보를 전달
            />
            <Quiz_item
                quizId={quizzes[5].quizId}
                quiz_title={quizzes[5].quizName}
                quiz_description={quizzes[5].quizDescription}
                Thumbnail={quizzes[5].thumbnailURL}
                onClick={() => handleShowFloat(quizzes[5])} // 클릭 시 quizzes[0] 정보를 전달
            />
            <Quiz_item
                quizId={quizzes[6].quizId}
                quiz_title={quizzes[6].quizName}
                quiz_description={quizzes[6].quizDescription}
                Thumbnail={quizzes[6].thumbnailURL}
                onClick={() => handleShowFloat(quizzes[6])} // 클릭 시 quizzes[0] 정보를 전달
            />
            <div className="create_new_quiz">
                <div className="new_quiz_plus">
                    +
                </div>
                <div className="new_quiz_text">
                    퀴즈 만들기
                </div>
            </div>
        </div>
        {showFloat && <Room_create_float quiz={selectedQuiz} onClose={handleCloseFloat}/>}
    </div>
}

export default Print_quiz;