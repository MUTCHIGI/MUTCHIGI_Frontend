import './CSS/SearchBar.css';
import Button from "./Button.jsx";
import Reload from "../../img/reload.png";
import {useState} from "react";

function SearchBar({multiplay,
                       selectedOption_privacy, setSelectedOption_privacy,
                       selectedOption_quiztype, setSelectedQuizType,
                       selectedOption_type, setSelectedOption_type,
                       quizOrder,setQuizOrder,
                       quizTitle,setQuizTitle,
                       refreshFlag,setRefreshFlag,
                       texts
                   }) {

    /* 멀티플레이 공개, 비공개 State*/
    let handlePrivacyChange = (isPublic) => {
        setSelectedOption_privacy(isPublic);
    };

    /*퀴즈 리스트 문제 분류 (전체,기본,악기분리)*/
    const handleClick = () => {
        setSelectedQuizType((prevIndex) => (prevIndex + 1) % texts.length); // 0, 1, 2를 순환
    };

    /* 대기방 타입 분류 (전체,커스텀,플레이리스트) */
    const handleTypeChange_1 = (e) => {
        setSelectedOption_type(Number(e.target.value)); // 선택된 값의 숫자로 상태 업데이트
    };

    const handleTypeChange_2 = (e) => {
        setQuizOrder(e.target.value);
    }

    const handleRefresh = () => {
        setRefreshFlag(!refreshFlag);
    }

    return <div className="SearchBar">
        {multiplay ?
            <select
                className="select_sorttype"
                value={selectedOption_type}
                onChange={handleTypeChange_1}>
                <option value={0}>
                    전체
                </option>
                <option value={1}>
                    커스텀
                </option>
                <option value={2}>
                    플레이리스트
                </option>
            </select>
            : <select
                className="select_sorttype"
                value={quizOrder}
                onChange={handleTypeChange_2}>
                <option value={"DATEDS"}>
                    최신순
                </option>
                <option value={"VIEWDS"}>
                    인기순
                </option>
            </select>
        }
        <div>
            <Button text={texts[selectedOption_quiztype]} onClick={handleClick} classname={"quiz_type"}/>
        </div>
        {multiplay &&
            <div className="search_by_public_or_private">
                공개
                <input
                    className="radio_room_public"
                    type="radio"
                    value="public"
                    checked={selectedOption_privacy === true}
                    onChange={() => handlePrivacyChange(true)}
                    name="PublicOrPrivate"
                />
                <div className="temp">
                    비공개
                </div>
                <input
                    className="radio_room_private"
                    type="radio"
                    value="private"
                    checked={selectedOption_privacy === false}
                    onChange={() => handlePrivacyChange(false)}
                    name="PublicOrPrivate"
                />
            </div>
        }
        <div className="search_by_keyword">
            <input
                className="input_keyword"
                type="text" name=""
                placeholder="검색어를 입력하십시오"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
            />
            <Button classname="search" logo={Reload} onClick={handleRefresh}/>
        </div>
    </div>
}

export default SearchBar;