import Header_top from "./components/Header_top.jsx";
import Header_bottom from "./components/Header_bottom.jsx";
import Home from "./pages/Home.jsx";
import {createContext, useEffect, useState} from "react";

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
  return (
      <WindowSizeContext.Provider value={windowSize}>
          <div className="App">
              <Home/>
          </div>
      </WindowSizeContext.Provider>
  )
}

export default App
