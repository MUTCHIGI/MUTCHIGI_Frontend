import './CSS/SearchBar.css';
import Button from "./Button.jsx";
import Search from "../../img/search.png";
import {useState} from "react";

function SearchBar({multiplay}) {

    let [selectedOption, setSelectedOption] = useState('');

    let handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return <div className="SearchBar">
        <select className="select_sorttype">
            <option>
                선택1
            </option>
            <option>
                선택2
            </option>
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
        <div className="search_by_keyword">
            <input className="input_keyword" type="text" name="" placeholder="검색어를 입력하십시오"/>
            <Button classname="search" logo={Search}/>
        </div>
    </div>
}

export default SearchBar;