import Button from "../Public/Button.jsx";
import {useState} from "react";

function PageMove({ info, handlers}) 
{
    const { currentPage, inputValue } = info;
    const { setCurrentPage, setInputValue } = handlers;

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

    return <div className="Footer">
        <div className="page_offset" style={{marginLeft: 'calc(var(--root--width)*0.115)', marginTop: 'calc(var(--root--height)* 0.03)' }}>
            <Button text={"<"} classname={"page_left"} onClick={handlePrevPage}/>
            <div className="cur_page">
                {currentPage}
            </div>
            <Button text={">"} classname={"page_right"} onClick={handleNextPage}/>
            <input
                className="input_page"
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                min="1"
            />
            <Button text={"이동"} classname={"page_move"} onClick={handlePageChange}/>
        </div>
    </div>
}

export default PageMove;