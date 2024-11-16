import Header_top from "./components/Public/Header_top.jsx";
import Header_bottom from "./components/Public/Header_bottom.jsx";
import Home from "./pages/Home.jsx";
import { createContext, useContext, useEffect, useState } from "react";
import Quiz_page from "./pages/Quiz_page.jsx";
import Footer from "./components/Public/Footer.jsx";
import Ingame from "./pages/Ingame.jsx";
import { AuthProvider, useAuth } from "./components/Login/AuthContext.jsx";
import { Route, Routes } from "react-router-dom";
import Quiz_create from "./pages/Quiz_create.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Quiz_page_Playlist from "./pages/Quiz_page_Playlist.jsx";

export let WindowSizeContext = createContext();

function App() {
    const [userInfo, setUserInfo] = useState(null);
    const [customOrplaylist, setCustomOrPlaylist] = useState(0);
    const [playListUrl, setPlayListUrl] = useState(null);

    // 방 생성에 필요한 요소들
    const [chatRoomId,setChatRoomId] = useState(-1);
    const [selectedQuiz, setSelectedQuiz] = useState(null); // 선택된 퀴즈 상태 추가
    let [privacy,setPrivacy] = useState('public');
    let [roomName, setRoomName] = useState(''); // 방 이름 상태
    let [createpassword, setCreatePassword] = useState(''); // 비밀번호 상태
    let [maxPlayer, setMaxPlayer] = useState(1); // 최대 플레이어 수 상태

    const [joinPassword,setJoinPassword] = useState('');

    // 최초 생성의 경우 true, 참여하는 경우 false
    let [firstCreate,setFirstCreate] = useState(true);

    let [windowSize,setWindowSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
            })
        }

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    document.documentElement.style.setProperty("--root--height", `${windowSize.height}px`);
    document.documentElement.style.setProperty("--root--width", `${windowSize.width}px`);

    const horizontalRatio = window.innerWidth / 1920;  // 기준 너비인 1920에 대한 비율
    const verticalRatio = window.innerHeight / 1080;   // 기준 높이인 1080에 대한 비율
    let ratio = Math.min(horizontalRatio, verticalRatio);
    document.documentElement.style.setProperty("--root--font--ratio", `${ratio}`);

    //Quiz Create에 Playlist URL 입력하기

  return (
      <div className="App">
          <WindowSizeContext.Provider value={windowSize}>
              <AuthProvider>
                  <Routes>
                      <Route path="/ingame" element={<Ingame
                          quiz={selectedQuiz}
                          chatRoomId={chatRoomId} setChatRoomId={setChatRoomId}
                          privacy={privacy}
                          roomName={roomName}
                          createPassword={createpassword}
                          joinPassword={joinPassword}
                          maxPlayer={maxPlayer}
                          userInfo={userInfo}
                          firstCreate={firstCreate} setFirstCreate={setFirstCreate}
                      />}/>
                      <Route path="/home" element={<Home
                          userInfo={userInfo} setUserInfo={setUserInfo}
                          setChatRoomId={setChatRoomId}
                          setFirstCreate={setFirstCreate}
                          selectedQuiz={selectedQuiz} setSelectedQuiz={setSelectedQuiz}
                          password={joinPassword} setPassword={setJoinPassword}
                          setRoomName={setRoomName}
                      />}/>
                      <Route path="/home/quiz" element={<Quiz_page
                          userInfo={userInfo} setUserInfo={setUserInfo}
                          customOrplaylist={customOrplaylist} setCustomOrPlaylist={setCustomOrPlaylist}
                          selectedQuiz={selectedQuiz} setSelectedQuiz={setSelectedQuiz}
                          setChatRoomId={setChatRoomId}
                          privacy={privacy} setPrivacy={setPrivacy}
                          roomName={roomName} setRoomName={setRoomName}
                          password={createpassword} setPassword={setCreatePassword}
                          maxPlayer={maxPlayer} setMaxPlayer={setMaxPlayer}
                          setFirstCreate={setFirstCreate}
                      />}/>
                      <Route path="/home/quiz/playlist" element={<Quiz_page_Playlist
                          userInfo={userInfo} setUserInfo={setUserInfo}
                          playlistUrl={playListUrl} setPlayListUrl={setPlayListUrl}
                          customOrplaylist={customOrplaylist} setCustomOrPlaylist={setCustomOrPlaylist}
                          setFirstCreate={setFirstCreate}
                      />}/>
                       <Route path="/home/quiz_create" element={<Quiz_create
                            userInfo={userInfo} setUserInfo={setUserInfo}
                            typeId={customOrplaylist}
                            userId={userInfo ? userInfo.userId : 0}
                            playListUrl={playListUrl}
                            setPlayListUrl={setPlayListUrl}
                        />} />
                  </Routes>
              </AuthProvider>
          </WindowSizeContext.Provider>
      </div>
  )
}

export default App
