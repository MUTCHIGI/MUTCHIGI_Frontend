import './CSS/Playlist.css';
import Button from "../Public/Button.jsx";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

function Playlist({playlistUrl,setPlayListUrl,
    customOrplaylist,setCustomOrPlayList
}) {
    const [inputUrl, setInputUrl] = useState(''); // 입력 URL을 위한 상태 추가
    const navigate = useNavigate(); // navigate 훅 사용

    const handleAddPlaylist = () => {
        setPlayListUrl(inputUrl); // input에 담긴 URL을 playlistUrl에 저장
        setCustomOrPlayList(2); // customOrplaylist를 2로 설정
        navigate('/home/quiz_create'); // /home/quiz_create로 이동
    };


    return <div className="Playlist">
        <div className="Playlist_explain">
            <div className="inner_box">
                퀴즈를 제작하고 싶은 노래들이 담긴 유튜브의 플레이리스트 URL을 하단의 빈칸에 입력후 생성 버튼을 눌러주세요.
            </div>
        </div>
        <div className="Playlist_create">
            <input
                className="Playlist_input"
                placeholder="URL을 여기에 입력하세요"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
            />
            <Button text={"추가!"} classname={"add_playlist"} onClick={handleAddPlaylist}/>
        </div>
    </div>
}

export default Playlist;