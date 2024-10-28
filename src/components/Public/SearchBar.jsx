import './CSS/SearchBar.css';
import Button from "./Button.jsx";
import Search from "../../img/search.png";
import {useState} from "react";

function SearchBar({multiplay}) {

    /* 멀티플레이 공개, 비공개 State*/
    let [selectedOption, setSelectedOption] = useState('');

    let handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    /*퀴즈 리스트 문제 분류 (전체,기본,악기분리)*/
    const [textIndex, setTextIndex] = useState(0); // 현재 텍스트의 인덱스 상태
    const texts = ["전체", "기본", "악기 분리"]; // 순환할 텍스트 배열

    const handleClick = () => {
        setTextIndex((prevIndex) => (prevIndex + 1) % texts.length); // 0, 1, 2를 순환
    };

    return <div className="SearchBar">
        <select className="select_sorttype">
            {multiplay ? <>
                <option>
                    전체
                </option>
                <option>
                    기본
                </option>
                <option>
                    악기분리
                </option>
            </> : <>
                <option>
                    최신순
                </option>
                <option>
                    인기순
                </option>
            </>}

        </select>
        {multiplay &&
            <div className="search_by_public_or_private">
            공개
                <input
                    className="radio_room_public"
                    type="radio"
                    value="public"
                    checked={selectedOption === 'public'}
                    onChange={handleOptionChange}
                    name="PublicOrPrivate"
                />
                <div className="temp">
                    비공개
                </div>
                <input
                    className="radio_room_private"
                    type="radio"
                    value="private"
                    checked={selectedOption === 'private'}
                    onChange={handleOptionChange}
                    name="PublicOrPrivate"
                />
            </div>
        }
        {!multiplay &&
        <div>
            <Button text={texts[textIndex]} onClick={handleClick} classname={"quiz_type"}/>
        </div>
        }
        <div className="search_by_keyword">
            <input className="input_keyword" type="text" name="" placeholder="검색어를 입력하십시오"/>
            <Button classname="search" logo={Search}/>
        </div>
    </div>
}

export default SearchBar;