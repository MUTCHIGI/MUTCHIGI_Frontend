import './CSS/Playlist.css';
import Button from "../Public/Button.jsx";

function Playlist() {
    return <div className="Playlist">
        <div className="Playlist_explain">
            <div className="inner_box">
                퀴즈를 제작하고 싶은 노래들이 담긴 유튜브의 플레이리스트 URL을 하단의 빈칸에 입력후 생성 버튼을 눌러주세요.
            </div>
        </div>
        <div className="Playlist_create">
            <input className="Playlist_input" placeholder="URL을 여기에 입력하세요"/>
            <Button text={"추가"} classname={"add_playlist"}/>
        </div>
    </div>
}

export default Playlist;