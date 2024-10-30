import Header_top from "./components/Public/Header_top.jsx";
import Header_bottom from "./components/Public/Header_bottom.jsx";
import Home from "./pages/Home.jsx";
import {createContext, useContext, useEffect, useState} from "react";
import Quiz_page from "./pages/Quiz_page.jsx";
import Footer from "./components/Public/Footer.jsx";
import Ingame from "./components/InGame/Ingame.jsx";
import {AuthProvider} from "./components/Login/AuthContext.jsx";
import {Route, Routes} from "react-router-dom";

export let WindowSizeContext = createContext();

function App() {

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

    let ratio = (((window.innerHeight**2) + (window.innerWidth**2))/4852800)**0.5;
    document.documentElement.style.setProperty("--root--font--ratio",`${ratio}`);

  return (
      <div className="App">
          <WindowSizeContext.Provider value={windowSize}>
              <AuthProvider>
                  <Routes>
                      <Route path="/" element={<Home/> }/>
                      <Route path="/quiz" element={<Quiz_page />}/>
                  </Routes>
              </AuthProvider>
          </WindowSizeContext.Provider>
      </div>
  )
}

export default App
