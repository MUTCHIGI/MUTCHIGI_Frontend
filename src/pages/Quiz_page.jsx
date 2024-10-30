import Header_top from "../components/Public/Header_top.jsx";
import Header_bottom from "../components/Public/Header_bottom.jsx";
import SearchBar from "../components/Public/SearchBar.jsx";
import Print_games from "../components/Games/Print_games.jsx";
import Footer from "../components/Public/Footer.jsx";
import {useEffect, useState} from "react";
import Print_quiz from "../components/Quiz/Print_quiz.jsx";
import {useAuth} from "../components/Login/AuthContext.jsx";

function Quiz_page() {
    let {token} = useAuth();

    // API를 통해 받아온 퀴즈들의 ID 리스트
    const [quizIds,setQuizIds] = useState([]);

    // 페이지 오프셋
    const [offset,setOffset] = useState(8);

    /* ------------------------------header_bottom state------------------------------ */

    const [customOrplaylist,setCustomOrPlaylist] = useState(0);

    /* ------------------------------header_bottom state------------------------------ */

    /* ------------------------------searchbar state------------------------------ */

    // 멀티플레이 공개, 비공개 State
    const [selectedOption_privacy, setSelectedOption_privacy] = useState(true);

    // 퀴즈 리스트 문제 분류 (전체,기본,악기분리)
    const [selectedOption_quiztype, setSelectedQuizType] = useState(0); // 현재 텍스트의 인덱스 상태
    const texts = ["전체", "기본", "악기 분리"]; // 순환할 텍스트 배열

    // 대기방 타입 분류 (전체,커스텀,플레이리스트)
    const [selectedOption_type, setSelectedOption_type] = useState(4); // 초기 상태 설정

    // 퀴즈 정렬 순서 설정 (인기순,최신순)
    const [selectedOption_quizOrder,setSelectedOption_quizOrder] = useState('DATEDS');

    // 검색어
    const [quizTitle,setQuizTitle] = useState('');

    /* ------------------------------footer state------------------------------ */

    // 버튼을 사용해 페이지 이동하는 state
    const [currentPage, setCurrentPage] = useState(1);

    // input 태그를 사용해 페이지 이동하는 state
    const [inputValue, setInputValue] = useState(currentPage); // input의 상태

    useEffect(() => {
        const fetchQuizIds = async () => {
            try {
                // URL 구성
                const response = await fetch(`http://localhost:8080/quiz/idList?page=${currentPage}&offset=${offset}&sort=${selectedOption_quizOrder}&quizTitle=${quizTitle}&modId=${customOrplaylist}&typeId=${selectedOption_quiztype}`,{
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
            }
        };

        fetchQuizIds();
    }, [token,currentPage, offset, selectedOption_type, quizTitle, customOrplaylist, selectedOption_quiztype,selectedOption_quizOrder]);

    return <div>
        <Header_top/>
        <Header_bottom
            quiz={true}
            customOrplaylist={customOrplaylist}
            setCustomOrPlaylist={setCustomOrPlaylist}
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
            texts={texts}
        />
        <Print_quiz quizIds={quizIds}/>
        <Footer
            multiplay={false}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            inputValue={inputValue}
            setInputValue={setInputValue}
        />
    </div>
}

export default Quiz_page;