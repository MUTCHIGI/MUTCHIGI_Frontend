import './SearchBar.css';
import Button from "./Button.jsx";
import Search from "../img/search.png";

function SearchBar() {
    return <div className="SearchBar">
        <select className="select_sorttype">
            <option>
                선택1
            </option>
            <option>
                선택2
            </option>
        </select>
        <div className="search_by_keyword">
            <input className="input_keyword" type="text" name="" placeholder="검색어를 입력하십시오"/>
            <Button classname="search" logo={Search}/>
        </div>
    </div>
}

export default SearchBar;