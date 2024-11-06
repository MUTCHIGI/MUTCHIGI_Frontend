import Header_top from "./components/Public/Header_top.jsx";
import Header_bottom from "./components/Public/Header_bottom.jsx";
import Home from "./pages/Home.jsx";
import {createContext, useContext, useEffect, useState} from "react";
import Quiz_page from "./pages/Quiz_page.jsx";
import Footer from "./components/Public/Footer.jsx";
import Ingame from "./components/InGame/Ingame.jsx";
import {AuthProvider, useAuth} from "./components/Login/AuthContext.jsx";
import {Route, Routes} from "react-router-dom";
import Quiz_create from "./pages/Quiz_create.jsx";
import {GoogleOAuthProvider} from "@react-oauth/google";
import Quiz_page_Playlist from "./pages/Quiz_page_Playlist.jsx";

export let WindowSizeContext = createContext();

function App() {
    const [userInfo, setUserInfo] = useState(null);
    const [customOrplaylist,setCustomOrPlaylist] = useState(0);
    const [playListUrl,setPlayListUrl] = useState(null);

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

        window.addEventListener('resize',handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    document.documentElement.style.setProperty("--root--height",`${windowSize.height}px`);
    document.documentElement.style.setProperty("--root--width",`${windowSize.width}px`);

    const horizontalRatio = window.innerWidth / 1920;  // 기준 너비인 1920에 대한 비율
    const verticalRatio = window.innerHeight / 1080;   // 기준 높이인 1080에 대한 비율
    let ratio = Math.min(horizontalRatio, verticalRatio);
    document.documentElement.style.setProperty("--root--font--ratio",`${ratio}`);

    //Quiz Create에 Playlist URL 입력하기

  return (
      <div className="App">
          <WindowSizeContext.Provider value={windowSize}>
              <AuthProvider>
                  <Routes>
                      <Route path="/ingame" element={<Ingame/>}/>
                      <Route path="/home" element={<Home userInfo={userInfo} setUserInfo={setUserInfo}/> }/>
                      <Route path="/home/quiz" element={<Quiz_page
                          userInfo={userInfo} setUserInfo={setUserInfo}
                          customOrplaylist={customOrplaylist} setCustomOrPlaylist={setCustomOrPlaylist}
                      />}/>
                      <Route path="/home/quiz/playlist" element={<Quiz_page_Playlist
                          userInfo={userInfo} setUserInfo={setUserInfo}
                          playlistUrl={playListUrl} setPlayListUrl={setPlayListUrl}
                          customOrplaylist={customOrplaylist} setCustomOrPlaylist={setCustomOrPlaylist}
                      />}/>
                      <Route path="/home/quiz_create" element={<Quiz_create 
                          typeId={customOrplaylist}
                          userId={userInfo ? userInfo.userId : 0}
                          playListUrl={playListUrl}
                          setPlayListUrl={setPlayListUrl}
                      />}/>
                  </Routes>
              </AuthProvider>
          </WindowSizeContext.Provider>
      </div>
  )
}

export default App
