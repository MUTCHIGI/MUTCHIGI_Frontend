import React, { useState } from "react";
import MainInfo from "./Quiz_create_main";
import ModeSelection from "./Quiz_create_mode";
import OptionSelection from "./Quiz_create_option";
import QuizCreateList from "./Quiz_create_list_basic";
import styles from "./CSS/Quiz_create.module.css";

function QuizCreate({ userId, token, typeId }) {
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [mode, setMode] = useState(-1);
  const [timeLimit, setTimeLimit] = useState(0);
  const [hints, setHints] = useState([]);
  const [instrument, setInstrument] = useState(-1);
  const [quizId, setQuizId] = useState(0);

  const handleThumbnailChange = (e) => setThumbnail(e.target.files[0]);
  const handleModeSelect = (selectedMode) => setMode(selectedMode);
  const prevStep = () => step > 1 && setStep(step - 1);

  const postThumbnail = () => {
    const formData = new FormData();
    formData.append("image", thumbnail); // thumbnail 이미지 파일 추가

    fetch(`http://localhost:8080/createQuiz/image?quizId=${quizId}`, {
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

  const postQuiz = () => {
    return fetch("http://localhost:8080/createQuiz", {
      method: "POST",
      headers: {
        "accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token,
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
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to create quiz");
        }
        return response.text();
      })
      .then((data) => {
        const quizIdNumber = parseInt(data, 10);
        if (!isNaN(quizIdNumber)) {
          setQuizId(quizIdNumber);
        }
        if (thumbnail) {
          postThumbnail();
        }
        return true;
      })
      .catch((error) => {
        console.error("Error:", error);
        return false;
      });
  };

  const nextStep = () => {
    if (step === 1 && mode != -1) {
      setStep(step + 1);
    }
    else if (step === 2 && title && description && (mode === 0 || mode === 1 && instrument != -1)) {
      // postQuiz()
      //   .then((success) => {
      //     if (success) {
      //       setStep(step + 1);
      //     }
      //   })
      //   .catch((error) => {
      //     console.error("Error in postQuiz:", error);
      //   });
      setStep(step + 1);
    }
  };

const getMainInfo = () => {
  const info = { title, description, thumbnail };
  const handlers = { setTitle, setDescription, handleThumbnailChange };
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
  <QuizCreateList
    quizId={quizId}
    hintSetting={hints}
    token={token}
  />
);

const steps = [getMode, getMainInfo, getlist];

return (
  <div className={styles["quiz-container"]}>
    {steps[step - 1]()}
    <div className={styles["navigation-buttons"]}>
      <button
        type="button"
        onClick={prevStep}
        className={styles["nav-button"]}
        style={{ visibility: step === 1 ? "hidden" : "visible" }}
      >
        {step === 2 ? "모드 선택" : step === 3 ? "기본 설정" : ""}
      </button>
      <button
        type="button"
        onClick={nextStep}
        className={styles["nav-button"]}
      >
        {step === 1 ? "기본 설정" : step === 2 ? "음악 추가" : step === 3 ? "퀴즈 생성" : ""}
      </button>
    </div>
  </div>
);
}

export default QuizCreate;