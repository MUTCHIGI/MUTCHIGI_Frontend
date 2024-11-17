import './CSS/Print_quiz.css';
import Quiz_item from "./Quiz_item.jsx";
import Button from "../Public/Button.jsx";
import Yt_logo from "../../img/Yt_logo.png"
import Thumbnail from '../../img/QuizItemTest/no_img.png';
import Logo from '../../img/Yt_logo.png';
import {useEffect, useState} from "react";
import Room_create_float from "./Room_create_float.jsx";
import {useAuth} from "../Login/AuthContext.jsx";
import {useNavigate} from "react-router-dom";


function Print_quiz({quizIds,
                    customOrplaylist,setCustomOrPlaylist,
                        selectedQuiz,setSelectedQuiz,
                        userInfo,setChatRoomId,
                        privacy,setPrivacy,
                        roomName,setRoomName,
                        password,setPassword,
                        maxPlayer,setMaxPlayer,
                        setFirstCreate,
}) {
    let navigate = useNavigate();
    let {token} = useAuth();

    // 빈 퀴즈 객체 정의
    const emptyQuiz = {
        quizId: null,
        songCount: 0,
        quizName: "빈 퀴즈",
        quizDescription: "설명이 없습니다.",
        releaseDate: "2024-10-30",
        userPlayCount: 0,
        typeId: 1,
        modId: 1,
        hintCount: 0,
        songPlayTime: {
            hour: 0,
            minute: 0,
            second: 0,
            nano: 0,
        },
        thumbnailURL: "",
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
    const [quizThumbURL, setQuizThumbURL] = useState([]); // thumbnailURL을 저장할 상태 배열
    const [imageSrc, setImageSrc] = useState([]);

    useEffect(() => {
        // quizzes 배열이 변할 때마다 quizThumbURL 배열을 업데이트
        const newQuizThumbURL = quizzes.map(quiz => quiz.thumbnailURL);
        setQuizThumbURL(newQuizThumbURL);
    }, [quizzes]); // quizzes 배열이 바뀔 때마다 실행됨

    useEffect(() => {
        const fetchImage = async (url) => {
            if (url === "" || url === null) {
                // 빈 문자열이면 그냥 빈 문자열 저장
                return "";
            }

            try {
                console.log(url);
                console.log(`${import.meta.env.VITE_SERVER_IP}/quiz/images/${url}`);
                const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/quiz/images/${url}`);
                if (response.ok) {
                    const data = await response.blob();
                    console.log(data);
                    // Blob URL을 생성하여 반환
                    const image = URL.createObjectURL(data);
                    return image; // 생성된 이미지 URL 반환
                } else {
                    console.error("Failed to fetch image:", response.status);
                    return ""; // 실패한 경우 빈 문자열 반환
                }
            } catch (error) {
                console.error("Error fetching image:", error);
                return ""; // 오류 발생시 빈 문자열 반환
            }
        };

        const updateImageSrc = async () => {
            const newImageSrc = [];

            // for (let i = 0; i < quizThumbURL.length; i++) {
            //     const image = await fetchImage(quizThumbURL[i]);
            //     newImageSrc.push(image);
            // }
            console.log(quizThumbURL[0])
            const image = await fetchImage(quizThumbURL[0])

            setImageSrc(image);
        };

        if (quizThumbURL.length > 0) {
            updateImageSrc(); // quizThumbURL이 업데이트될 때마다 이미지 데이터 요청
        }
    }, [quizThumbURL]); // quizThumbURL이 변경될 때마다 실행


    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                // quizIds가 비어있지 않은 경우에만 요청을 보냄
                if (quizIds.length === 0) {
                    const emptyQuizzes = Array(7).fill(emptyQuiz);
                    setQuizzes(emptyQuizzes);
                    return;
                }

                // 모든 quizId를 queryString으로 변환하여 요청 URL 구성
                const queryString = quizIds.map(id => `idList=${id}`).join('&');
                const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/quiz/Entities?${queryString}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // 필요하다면 토큰 포함
                        'Content-Type': 'application/json'
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                // 7개 미만인 경우 빈 퀴즈 객체를 추가
                const filledQuizzes = [...data];
                while (filledQuizzes.length < 7) {
                    filledQuizzes.push(emptyQuiz);
                }

                setQuizzes(filledQuizzes); // 성공적으로 받아온 데이터 저장
            } catch (error) {
                console.error('Failed to fetch quiz entities:', error);
            }
        };

        fetchQuizzes();
    }, [quizIds, token]);

    /* 방을 생성하기 위한 핸들러 */
    let [showFloat,setShowFloat] = useState(false);

    let handleShowFloat = (quiz) => {
        setSelectedQuiz(quiz);
        setShowFloat(true);
    }

    let handleCloseFloat = () => {
        setShowFloat(false);
    }

    // 퀴즈 만들기 버튼
    const handleDivClick = () => {
        if (customOrplaylist === 2) {
            navigate('/home/quiz/playlist'); // customOrplaylist가 2일 경우 이 경로로 이동
        } else {
            navigate('/home/quiz_create'); // 그렇지 않으면 원래 경로로 이동
        }
    };

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
                Thumbnail={imageSrc[0]!=="" ? imageSrc[0] : Thumbnail}
                onClick={() => handleShowFloat(quizzes[0])} // 클릭 시 quizzes[0] 정보를 전달
            />
            <Quiz_item
                quizId={quizzes[1].quizId}
                quiz_title={quizzes[1].quizName}
                quiz_description={quizzes[1].quizDescription}
                Thumbnail={imageSrc[1]!=="" ? imageSrc[1] : Thumbnail}
                onClick={() => handleShowFloat(quizzes[1])} // 클릭 시 quizzes[0] 정보를 전달
            />
            <Quiz_item
                quizId={quizzes[2].quizId}
                quiz_title={quizzes[2].quizName}
                quiz_description={quizzes[2].quizDescription}
                Thumbnail={imageSrc[2]!=="" ? imageSrc[2] : Thumbnail}
                onClick={() => handleShowFloat(quizzes[2])} // 클릭 시 quizzes[0] 정보를 전달
            />
            <Quiz_item
                quizId={quizzes[3].quizId}
                quiz_title={quizzes[3].quizName}
                quiz_description={quizzes[3].quizDescription}
                Thumbnail={imageSrc[3]!=="" ? imageSrc[3] : Thumbnail}
                onClick={() => handleShowFloat(quizzes[3])} // 클릭 시 quizzes[0] 정보를 전달
            />
            <Quiz_item
                quizId={quizzes[4].quizId}
                quiz_title={quizzes[4].quizName}
                quiz_description={quizzes[4].quizDescription}
                Thumbnail={imageSrc[4]!=="" ? imageSrc[4] : Thumbnail}
                onClick={() => handleShowFloat(quizzes[4])} // 클릭 시 quizzes[0] 정보를 전달
            />
            <Quiz_item
                quizId={quizzes[5].quizId}
                quiz_title={quizzes[5].quizName}
                quiz_description={quizzes[5].quizDescription}
                Thumbnail={imageSrc[5]!=="" ? imageSrc[5] : Thumbnail}
                onClick={() => handleShowFloat(quizzes[5])} // 클릭 시 quizzes[0] 정보를 전달
            />
            <Quiz_item
                quizId={quizzes[6].quizId}
                quiz_title={quizzes[6].quizName}
                quiz_description={quizzes[6].quizDescription}
                Thumbnail={imageSrc[6]!=="" ? imageSrc[6] : Thumbnail}
                onClick={() => handleShowFloat(quizzes[6])} // 클릭 시 quizzes[0] 정보를 전달
            />
            <div className="create_new_quiz" onClick={handleDivClick}>
                <div className="new_quiz_plus">
                    +
                </div>
                <div className="new_quiz_text">
                    퀴즈 만들기
                </div>
            </div>
        </div>
        {showFloat && (
            <>
                <div className="backdrop" onClick={handleCloseFloat}></div>
                <div className="modal">
                    <Room_create_float
                        userInfo={userInfo}
                        quiz={selectedQuiz}
                        onClose={handleCloseFloat}
                        setChatRoomId={setChatRoomId}
                        privacy={privacy} setPrivacy={setPrivacy}
                        roomName={roomName} setRoomName={setRoomName}
                        password={password} setPassword={setPassword}
                        maxPlayer={maxPlayer} setMaxPlayer={setMaxPlayer}
                        setFirstCreate={setFirstCreate}
                    />
                </div>
            </>
        )}
    </div>
}

export default Print_quiz;