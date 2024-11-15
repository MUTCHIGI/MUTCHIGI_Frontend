import Header_top from "../components/Public/Header_top.jsx";
import Header_bottom from "../components/Public/Header_bottom.jsx";
import Playlist from "../components/Quiz/Playlist.jsx";

function Quiz_page_Playlist({
                                playlistUrl,setPlayListUrl,
    userInfo,setUserInfo,
    customOrplaylist,setCustomOrPlaylist,
    setFirstCreate
}) {


    return <div>
        <Header_top userInfo={userInfo} setUserInfo={setUserInfo} setFirstCreate={setFirstCreate}/>
        <Header_bottom
            quiz={false}
        />
        <Playlist
            playlistUrl={playlistUrl} setPlayListUrl={setPlayListUrl}
            customOrplaylist={customOrplaylist} setCustomOrPlayList={setCustomOrPlaylist}
        />
    </div>
}

export default Quiz_page_Playlist;