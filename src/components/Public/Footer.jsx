import './CSS/Footer.css';
import Button from "./Button.jsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Login/AuthContext.jsx";
import WarningModal from '../Public/Error';

function Footer({
    multiplay,
    currentPage, setCurrentPage,
    inputValue, setInputValue,
}) {
    const { token } = useAuth();

    // 에러 모달
    const [err, setError] = useState({ hasError: false, title: "", message: "" });

    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1)); // 1보다 작아지지 않도록 설정
    };

    const handleNextPage = () => {
        setCurrentPage((prevPage) => prevPage + 1); // 페이지 수를 1 증가
    };

    const handlePageChange = () => {
        const newPage = Number(inputValue); // input에서 숫자 값을 가져옴
        if (newPage > 0) { // 1보다 큰 경우에만 업데이트
            setCurrentPage(newPage);
        }
    };

    // Quiz 페이지로 이동
    const navigate = useNavigate();

    const gotoQuiz = () => {
        if (token !== null) {
            navigate('/home/quiz');
        }
        else {
            // alert("로그인 후 이용하여 주시기 바랍니다.");
            setError({
                ...err,
                hasError: true,
                title: "로그인 필요",
                message: "로그인 후 이용하여 주시기 바랍니다."
            });
        }
    };

    const handleClose = () => {
        setError({
            ...err,
            hasError: false,
            title: "",
            message: ""
        });
        navigate('/home');
    };

    return <div className="Footer">
        <WarningModal
            show={err.hasError}
            setError={(flag) => setError(flag)}
            title={err.title}
            message={err.message}
            onHide={handleClose}
        />
        <div className="page_offset">
            <Button text={"<"} classname={"page_left"} onClick={handlePrevPage} />
            <div className="cur_page">
                {currentPage}
            </div>
            <Button text={">"} classname={"page_right"} onClick={handleNextPage} />
            <input
                className="input_page"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                min="1"
            />
            <Button text={"이동"} classname={"page_move"} onClick={handlePageChange} />
        </div>
        {multiplay && <Button text={"방 만들기"} classname={"create_room"} onClick={gotoQuiz} />}
    </div>
}

export default Footer;