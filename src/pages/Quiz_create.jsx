import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import Header_top from "../components/Public/Header_top.jsx";
import Header_bottom from "../components/Public/Header_bottom.jsx";
import MainInfo from "../components/Quiz/Quiz_create_main.jsx";
import ModeSelection from "../components/Quiz/Quiz_create_mode.jsx";
import OptionSelection from "../components/Quiz/Quiz_create_option.jsx";
import QuizCreateList from "../components/Quiz/Quiz_create_list_basic.jsx";
import QuizCreateListAi from "../components/Quiz/Quiz_create_list_ai.jsx"
import styles from "../components/Quiz/CSS/Quiz_create.module.css";
import { useAuth } from "../components/Login/AuthContext.jsx";
import spinner from "../img/loading.svg"

function QuizCreate({ userInfo, setUserInfo, userId, typeId: initialTypeId, playListUrl, setPlayListUrl }) {
  // quiz main info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);

  // quiz option info
  const [mode, setMode] = useState(0);
  const [timeLimit, setTimeLimit] = useState(0);
  const [hints, setHints] = useState([]);
  const [instrument, setInstrument] = useState(-1);

  // page logic
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // api info
  const [quizId, setQuizId] = useState(-1);
  const { token } = useAuth();
  const [typeId, setTypeId] = useState(initialTypeId);

  useEffect(() => {
    if (typeId === 0) {
      setTypeId(1);
    }
  }, [typeId]);

  useEffect(() => {
    if (token === null) {
      alert("로그인 후 이용하여 주시기 바랍니다.");
      navigate('/home'); // 원하는 주소로 변경
    }
  }, [token]);

  const handleModeSelect = (selectedMode) => setMode(selectedMode);
  const prevStep = () => step > 1 && setStep(step - 1);

  let navigate = useNavigate()


  const postThumbnail = () => {
    const formData = new FormData();
    formData.append("image", thumbnail); // thumbnail 이미지 파일 추가

    fetch(`http://localhost:8080/quiz/createQuiz/image?quizId=${quizId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Accept": "*/*",
      },
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to upload image");
        }
        return response.json();
      })
  }

  const postUrl = async (quizIdNumber) => {
    const response = await fetch(`http://localhost:8080/song/youtube/myPlaylist`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "*/*",
      },
      body: JSON.stringify({
        myPlayListURL: playListUrl,
        quizId: quizIdNumber,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to post url");
    }

    const data = await response.json();
    return data; // 필요 시 응답 데이터 반환
  }

  const postHints = async (quizIdNumber) => {
    const hintsPayload = hints.map((hint) => {
      // hint.value = hour * 3600 + minute * 60 + second + '초 후'
      console.log(hint);
      const totalSeconds = parseInt(hint.time.replace('초 후', ''), 10);
      const hour = Math.floor(totalSeconds / 3600);
      const minute = Math.floor((totalSeconds % 3600) / 60);
      const second = totalSeconds % 60;

      return {
        hour: hour,
        minute: minute,
        second: second,
        hintType: hint.text,
      };
    });

    const response = await fetch(`http://localhost:8080/quiz/${quizIdNumber}/hintState`, {
      method: "POST",
      headers: {
        "Accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(hintsPayload),
    });

    if (!response.ok) {
      throw new Error("Failed to post hints");
    }
  };


  const postQuiz = async () => {
    const response = await fetch("http://localhost:8080/quiz/createQuiz", {
      method: "POST",
      headers: {
        "accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        quizName: title,
        quizDescription: description,
        typeId: typeId,
        modId: mode,
        hintCount: hints.length,
        hour: Math.floor(timeLimit / 3600),
        minute: Math.floor((timeLimit % 3600) / 60),
        second: timeLimit % 60,
        instrumentId: instrument === -1 ? 0 : instrument,
        userId: userId,
        useDisAlg: true,
      }),
    })
    if (!response.ok) {
      throw new Error("Failed to create quiz");
    }
    const id = await response.text();
    const quizIdNumber = parseInt(id, 10);
    if (!isNaN(quizIdNumber)) {
      setQuizId(quizIdNumber);
      await postHints(quizIdNumber);
    }
    if (thumbnail) {
      postThumbnail();
    }
    if (playListUrl) {
      await postUrl(quizIdNumber);
      setPlayListUrl(null);
    }
    return true;
  };

  const nextStep = async () => {
    if (step === 1 && mode) {
      setStep(step + 1);
    }
    else if (step === 2 && title && description && (mode === 1 || (mode === 2 && instrument != -1))) {
      try {
        setIsLoading(true);
        const success = await postQuiz();
        setIsLoading(false);
        if (success) {
          setStep(step + 1);
        }
      }
      catch (error) {
        console.error("Error in postQuiz:", error);
        setIsLoading(false);
      }
    }
  };

  const getMainInfo = () => {
    const info = { title, description, thumbnail };
    const handlers = { setTitle, setDescription, setThumbnail };
    const optionInfo = { timeLimit, hints, instrument, mode };
    const optionHandlers = { setTimeLimit, setHints, setInstrument };

    return (
      <div className={styles["main-info"]}>
        <MainInfo
          info={info}
          handlers={handlers}
        />
        <OptionSelection
          info={optionInfo}
          handlers={optionHandlers}
        />
      </div>
    );
  };

  const getMode = () => (
    <ModeSelection mode={mode} handleModeSelect={handleModeSelect} />
  );

  const getlist = () => (
    mode === 1 ? (
      <QuizCreateList
        quizId={quizId}
        hintSetting={hints}
        token={token}
      />
    ) : (
      <QuizCreateListAi
        quizId={quizId}
        instrumentId={instrument}
        hintSetting={hints}
        token={token}
      />
    )
  );

  const steps = [getMode, getMainInfo, getlist];


  return (
    <div className={styles["quiz-container"]}>
      <Header_top userInfo={userInfo} setUserInfo={setUserInfo} />
      <Header_bottom
        quiz={false}
      />
      {isLoading ? (
        <div className={styles["loading-screen"]}>
          <div className={styles["loading-component"]}>
            <img
              src={spinner}
              style={{ width: '100%', height: '100%' }}
            >
            </img>
          </div>
          <h1 className={styles["loading-title"]}>
            퀴즈 생성 중...
          </h1>
        </div>
      ) : (
        <>
          {steps[step - 1]()}
          {step < 3 ? (
            <div className={styles["navigation-buttons"]}>
              <button
                type="button"
                onClick={prevStep}
                className={styles["nav-button"]}
                style={{ visibility: (step === 2) ? "visible" : "hidden" }}
              >
                {step === 2 ? "모드 선택" : step === 3 ? "기본 설정" : ""}
              </button>
              <button
                type="button"
                onClick={nextStep}
                className={styles["nav-button"]}
                style={{ visibility: (step < 3) ? "visible" : "hidden" }}
              >
                {step === 1 ? "기본 설정" : step === 2 ? "음악 추가" : ""}
              </button>
            </div>
          ) : ''}
        </>
      )}
    </div>
  );
}

export default QuizCreate;