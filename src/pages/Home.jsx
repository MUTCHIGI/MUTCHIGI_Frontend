import Header_top from "../components/Public/Header_top.jsx";
import Header_bottom from "../components/Public/Header_bottom.jsx";
import SearchBar from "../components/Public/SearchBar.jsx";
import Print_quiz from "../components/Quiz/Print_quiz.jsx";
import Footer from "../components/Public/Footer.jsx";
import Playlist from "../components/Quiz/Playlist.jsx";
import Print_games from "../components/Games/Print_games.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useAuth} from "../components/Login/AuthContext.jsx";

function Home({userInfo,setUserInfo,
    setChatRoomId,setFirstCreate,
    selectedQuiz,setSelectedQuiz,
              }) {
    let token = useAuth();
    // API를 통해 받아온 방들의 ID 리스트
    const [roomIds,setRoomIds] = useState([]);

    // 페이지 오프셋
    const [offset,setOffset] = useState(6);


    /* ------------------------------searchbar state------------------------------ */

    // 멀티플레이 공개, 비공개 State
    const [selectedOption_privacy, setSelectedOption_privacy] = useState(true);

    // 퀴즈 리스트 문제 분류 (전체,기본,악기분리)
    const [selectedOption_quiztype, setSelectedQuizType] = useState(0); // 현재 텍스트의 인덱스 상태
    const texts = ["전체", "기본", "악기 분리"]; // 순환할 텍스트 배열

    // 대기방 타입 분류 (전체,커스텀,플레이리스트) or 퀴즈 정렬 기준 (최신순,인기순)
    const [selectedOption_type, setSelectedOption_type] = useState(0); // 초기 상태를 0으로 설정

    // 검색어
    const [quizTitle,setQuizTitle] = useState('');

    /* ------------------------------footer state------------------------------ */

    // 버튼을 사용해 페이지 이동하는 state
    const [currentPage, setCurrentPage] = useState(1);

    // input 태그를 사용해 페이지 이동하는 state
    const [inputValue, setInputValue] = useState(currentPage); // input의 상태

    /* ------------------------------리스트 받아오기------------------------------ */

    useEffect(() => {
        const fetchRoomIds = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/room/idList?page=${currentPage}&offset=${offset}&modId=${selectedOption_type}&typeId=${selectedOption_quiztype}&quizTitle=${quizTitle}&publicRoom=${selectedOption_privacy}`);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json().catch(() => []);
                setRoomIds(data);
            } catch (error) {
                console.error('Failed to fetch room IDs:', error);
            }
        };

        fetchRoomIds();
    }, [currentPage,offset,selectedOption_type,selectedOption_quiztype,quizTitle,selectedOption_privacy]);


    return <div>
        <Header_top userInfo={userInfo} setUserInfo={setUserInfo} setFirstCreate={setFirstCreate}/>
        <Header_bottom/>
        <SearchBar
            multiplay={true}
            selectedOption_privacy={selectedOption_privacy}
            setSelectedOption_privacy={setSelectedOption_privacy}
            selectedOption_quiztype={selectedOption_quiztype}
            setSelectedQuizType={setSelectedQuizType}
            selectedOption_type={selectedOption_type}
            setSelectedOption_type={setSelectedOption_type}
            texts={texts}
        />
        <Print_games
            roomIds={roomIds}
            setChatRoomId={setChatRoomId}
            setFirstCreate={setFirstCreate}
            selectedQuiz={selectedQuiz}
            setSelectedQuiz={setSelectedQuiz}
        />
        <Footer
            multiplay={true}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            inputValue={inputValue}
            setInputValue={setInputValue}
        />
    </div>
}

export default Home;