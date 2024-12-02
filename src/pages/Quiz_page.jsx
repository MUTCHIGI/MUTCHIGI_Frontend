import Header_top from "../components/Public/Header_top.jsx";
import Header_bottom from "../components/Public/Header_bottom.jsx";
import SearchBar from "../components/Public/SearchBar.jsx";
import Print_games from "../components/Games/Print_games.jsx";
import Footer from "../components/Public/Footer.jsx";
import { useEffect, useState } from "react";
import Print_quiz from "../components/Quiz/Print_quiz.jsx";
import { useAuth } from "../components/Login/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import WarningModal from '../components/Public/Error';

function Quiz_page({
    userInfo, setUserInfo,
    customOrplaylist, setCustomOrPlaylist,
    selectedQuiz, setSelectedQuiz,
    setChatRoomId,
    privacy, setPrivacy,
    roomName, setRoomName,
    password, setPassword,
    maxPlayer, setMaxPlayer,
    setFirstCreate,
    setRestartQuizId,
}) {
    let { token } = useAuth();
    let navigate = useNavigate();

    // API를 통해 받아온 퀴즈들의 ID 리스트
    const [quizIds, setQuizIds] = useState([]);

    // 페이지 오프셋
    const [offset, setOffset] = useState(7);

    /* ------------------------------header_bottom state------------------------------ */

    /* ------------------------------header_bottom state------------------------------ */

    /* ------------------------------searchbar state------------------------------ */

    // 멀티플레이 공개, 비공개 State
    const [selectedOption_privacy, setSelectedOption_privacy] = useState(true);

    // 퀴즈 리스트 문제 분류 (전체,기본,악기분리)
    const [selectedOption_quiztype, setSelectedQuizType] = useState(0); // 현재 텍스트의 인덱스 상태
    const texts = ["전체", "기본", "악기 분리"]; // 순환할 텍스트 배열

    // 대기방 타입 분류 (전체,커스텀,플레이리스트) or 최신순,인기순
    const [selectedOption_type, setSelectedOption_type] = useState(4); // 초기 상태 설정

    // 퀴즈 정렬 순서 설정 (인기순,최신순)
    const [selectedOption_quizOrder, setSelectedOption_quizOrder] = useState('DATEDS');

    // 검색어
    const [quizTitle, setQuizTitle] = useState('');

    // 새로고침
    const [refreshFlag, setRefreshFlag] = useState(false);

    /* ------------------------------footer state------------------------------ */

    // 버튼을 사용해 페이지 이동하는 state
    const [currentPage, setCurrentPage] = useState(1);

    // input 태그를 사용해 페이지 이동하는 state
    const [inputValue, setInputValue] = useState(currentPage); // input의 상태

    // 에러 모달
    const [errMessage, setErrorMessage] = useState({ hasError: false, title: "", message: "" });

    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchQuizIds = async () => {
            try {
                // URL 구성
                const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/quiz/idList?page=${currentPage}&offset=${offset}&sort=${selectedOption_quizOrder}&quizTitle=${quizTitle}&modId=${customOrplaylist}&typeId=${selectedOption_quiztype}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // JWT 토큰 포함
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json().catch(() => []);
                setQuizIds(data);  // 성공적으로 받아온 데이터 저장
            } catch (error) {
                console.error('Failed to fetch quiz IDs:', error);
                setError('Failed to fetch user information');
            }
        };

        fetchQuizIds();
    }, [token, currentPage, offset, selectedOption_type, quizTitle, customOrplaylist, selectedOption_quiztype, selectedOption_quizOrder, refreshFlag]);

    useEffect(() => {
        if (token === null) {
            setErrorMessage({
                ...err,
                hasError: true,
                title: "로그인 필요",
                message: "로그인 후 이용하여 주시기 바랍니다."
              });
            // alert("로그인 후 이용하여 주시기 바랍니다.");
            // navigate('/home');
        }
    }, [token]);

    const handleClose = () => {
        setError({
            ...err,
            hasError: false,
            title: "",
            message: ""
        });
        navigate('/home');
    };

    return <div>
        <Header_top userInfo={userInfo} setUserInfo={setUserInfo} setFirstCreate={setFirstCreate} setRestartQuizId={setRestartQuizId} />
        <Header_bottom
            quiz={true}
            customOrplaylist={customOrplaylist}
            setCustomOrPlaylist={setCustomOrPlaylist}
        />
        <WarningModal
            show={errMessage.hasError}
            setError={(flag) => setErrorMessage(flag)}
            title={errMessage.title}
            message={errMessage.message}
            onHide={handleClose}
        />
        <SearchBar
            multiplay={false}
            selectedOption_privacy={selectedOption_privacy}
            setSelectedOption_privacy={setSelectedOption_privacy}
            selectedOption_quiztype={selectedOption_quiztype}
            setSelectedQuizType={setSelectedQuizType}
            selectedOption_type={selectedOption_type}
            setSelectedOption_type={setSelectedOption_type}
            quizOrder={selectedOption_quizOrder}
            setQuizOrder={setSelectedOption_quizOrder}
            quizTitle={quizTitle}
            setQuizTitle={setQuizTitle}
            refreshFlag={refreshFlag} setRefreshFlag={setRefreshFlag}
            texts={texts}
        />
        <Print_quiz quizIds={quizIds}
            customOrplaylist={customOrplaylist} setCustomOrPlaylist={setCustomOrPlaylist}
            userInfo={userInfo}
            selectedQuiz={selectedQuiz} setSelectedQuiz={setSelectedQuiz}
            setChatRoomId={setChatRoomId}
            privacy={privacy} setPrivacy={setPrivacy}
            roomName={roomName} setRoomName={setRoomName}
            password={password} setPassword={setPassword}
            maxPlayer={maxPlayer} setMaxPlayer={setMaxPlayer}
            setFirstCreate={setFirstCreate}
        />
        <Footer
            multiplay={false}
            currentPage={currentPage} setCurrentPage={setCurrentPage}
            inputValue={inputValue} setInputValue={setInputValue}
        />
    </div>
}

export default Quiz_page;