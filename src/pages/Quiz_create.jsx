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
import WarningModal from '../components/Public/Error';

function QuizCreate({ userInfo, setUserInfo, userId, typeId: initialTypeId, playListUrl, restartQuizId, setPlayListUrl, setFirstCreate, setRestartQuizId, }) {
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

  // error modal
  const [err, setError] = useState({ hasError: false, title: "", message: "" });

  const handleClose = () => {
    let flag;
    if (err.title === "네트워크 오류" || err.title === "로그인 필요" || err.title === "잘못된 URL" ||
      err.message === "3개 이상의 생성 중단한 퀴즈가 있습니다!\n프로필에서 퀴즈 이어가기로 생성 완료 후 다시 시도해 주세요" || err.title === "권한 부족"
    )
      flag = true;
    else
      flag = false;
    setError({
      ...err,
      hasError: false,
      title: "",
      message: ""
    });
    if (flag)
      navigate('/home');
  };


  useEffect(() => {
    if (typeId === 0) {
      setTypeId(1);
    }
  }, [typeId]);

  useEffect(() => {
    if (token === null) {
      // alert("로그인 후 이용하여 주시기 바랍니다.");
      setError({
        ...err,
        hasError: true,
        title: "로그인 필요",
        message: "로그인 후 이용하여 주시기 바랍니다."
      });
      // navigate('/home');
    }
  }, [token]);

  let navigate = useNavigate();

  useEffect(() => {
    const fetchQuizDetails = async () => {
      let tempQuizId = null;
      if (restartQuizId === -1) {
        const params = new URLSearchParams(location.search);
        const hasQuery = params.has('quiz_id');

        if (hasQuery) {
          const quizId = parseInt(params.get('quiz_id'), 10);
          if (!isNaN(quizId)) {
            tempQuizId = quizId;
          } else {
            return;
          }
        } else {
          return;
        }
      }
      else {
        tempQuizId = restartQuizId;
      }
      setIsLoading(true);
      const params = new URLSearchParams();
      params.set('quiz_id', `${tempQuizId}`);
      navigate(`?${params.toString()}`);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_IP}/quiz/Entity/restore?quizId=${tempQuizId}`,
          {
            headers: {
              "Authorization": `Bearer ${token}`,
              'accept': '*/*',
            },
          }
        );

        if (!response.ok) {
          setError({
            ...err,
            hasError: true,
            title: "권한 부족",
            message: "해당 유저의 퀴즈가 아닙니다"
          });
          // throw new Error('Failed to fetch quiz entity');
        }

        const data = await response.json();

        if (data) {
          const quiz = data;

          // mode가 2이면 state 업데이트
          if (quiz.typeId === 2) {
            setMode(2);
            setInstrument(quiz.instrumentId);
          }
          else {
            setMode(1);
          }
          setQuizId(tempQuizId);
          setRestartQuizId(-1);
          setIsLoading(false);
          setStep(3);
        }
      } catch (error) {
        // alert("네트워크 오류 발생");
        setError({
          ...err,
          hasError: true,
          title: "권한 부족",
          message: "해당 유저의 퀴즈가 아닙니다"
        });
        // setIsLoading(false);
        // navigate('/home');
      }
    };

    fetchQuizDetails();
  }, [restartQuizId]);

  const handleModeSelect = (selectedMode) => setMode(selectedMode);
  const prevStep = () => step > 1 && setStep(step - 1);


  const postThumbnail = (quizIdNumber) => {
    const formData = new FormData();
    formData.append("image", thumbnail); // thumbnail 이미지 파일 추가

    fetch(`${import.meta.env.VITE_SERVER_IP}/quiz/createQuiz/image?quizId=${quizIdNumber}`, {
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
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/song/youtube/myPlaylist`, {
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
      if (mode === 2) {
        // `playURL` 필드를 추출하여 각각 POST 요청
        for (const song of data) {
          const url = song.playURL;

          try {
            const publishResponse = await fetch(
              `${import.meta.env.VITE_SERVER_IP}/GCP/publish?youtubeURL=${encodeURIComponent(url)}`,
              {
                method: "POST",
                headers: {
                  "Authorization": `Bearer ${token}`,
                  "Accept": "*/*",
                },
              }
            );
            if (!publishResponse.ok) {
              console.error(`Failed to publish URL: ${url}`);
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    } catch (error) {
      // alert("비공개 플레이리스트는 변환 할 수 없습니다");
      setError({
        ...err,
        hasError: true,
        title: "잘못된 URL",
        message: "비공개 플레이리스트는 변환 할 수 없습니다"
      });
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/quiz/deleteNotReadyQuiz/${quizIdNumber}`, {
          method: 'DELETE',
          headers: {
            "Authorization": `Bearer ${token}`,
            'Accept': '*/*',
          },
        });
        if (!response.ok) {
          throw new Error("Failed to delete quiz");
        }

      }
      catch (error) {
        console.log(error);
      }
      // navigate("/home");
    }
  };

  const postHints = async (quizIdNumber) => {
    console.log(hints);
    const hintsPayload = hints.map((hint) => {
      // hint.value = hour * 3600 + minute * 60 + second + '초 후'
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
    console.log(hintsPayload);
    const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/quiz/${quizIdNumber}/hintState`, {
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
    console.log(import.meta.env.VITE_SERVER_IP);
    const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/quiz/createQuiz`, {
      method: "POST",
      headers: {
        "accept": "*/*",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        quizName: title,
        quizDescription: description,
        typeId: mode,
        modId: typeId,
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
      if (response.status === 405) {
        // alert("3개 이상의 생성 중단한 퀴즈가 있습니다!\n프로필에서 퀴즈 이어가기로 생성 완료 후 다시 시도해 주세요")
        setError({
          ...err,
          hasError: true,
          title: "퀴즈 생성 불가",
          message: "3개 이상의 생성 중단한 퀴즈가 있습니다!\n프로필에서 퀴즈 이어가기로 생성 완료 후 다시 시도해 주세요"
        });
        // navigate("/home");
      } else {
        throw new Error("동일한 이름의 퀴즈가 존재합니다");
      }
    }
    console.log("test2");
    const id = await response.text();
    console.log("test");
    const quizIdNumber = parseInt(id, 10);
    if (!isNaN(quizIdNumber)) {
      const params = new URLSearchParams();
      params.set('quiz_id', `${quizIdNumber}`);
      navigate(`?${params.toString()}`);
      setQuizId(quizIdNumber);
      await postHints(quizIdNumber);
      if (thumbnail) {
        postThumbnail(quizIdNumber);
      }
      if (playListUrl) {
        await postUrl(quizIdNumber);
        setPlayListUrl(null);
      }
    }
    return true;
  };

  const nextStep = async () => {
    if (step === 1 && mode) {
      setStep(step + 1);
    }
    else if (step === 2) {
      if (hints.some((hint) => !hint.text.trim())) {
        // alert("힌트 내용이 비어 있습니다. 모든 힌트를 입력해주세요.");
        setError({
          ...err,
          hasError: true,
          title: "퀴즈 생성 불가",
          message: "힌트 내용이 비어 있습니다. 모든 힌트를 입력해주세요."
        });
        return; // 조건이 충족되지 않으면 중단
      }
      else if (!title) {
        // alert("제목를 입력해주세요.");
        setError({
          ...err,
          hasError: true,
          title: "퀴즈 생성 불가",
          message: "제목를 입력해주세요."
        });
        return; // 조건이 충족되지 않으면 중단
      }
      else if (!description) {
        // alert("설명을 입력해주세요.");
        setError({
          ...err,
          hasError: true,
          title: "퀴즈 생성 불가",
          message: "설명을 입력해주세요."
        });
        return; // 조건이 충족되지 않으면 중단
      }
      else if (!(mode === 1 || (mode === 2 && instrument != -1))) {
        // alert("악기를 선택해주세요.");
        setError({
          ...err,
          hasError: true,
          title: "퀴즈 생성 불가",
          message: "악기를 선택해주세요."
        });
        return; // 조건이 충족되지 않으면 중단
      }
      try {
        setIsLoading(true);
        const success = await postQuiz();
        setIsLoading(false);
        if (success) {
          setStep(step + 1);
        }
      }
      catch (error) {
        // alert(error);
        console.log(error);
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
        token={token}
      />
    ) : (
      <QuizCreateListAi
        quizId={quizId}
        instrumentId={instrument}
        token={token}
      />
    )
  );

  const steps = [getMode, getMainInfo, getlist];


  return (
    <div className={styles["quiz-container"]}>
      <Header_top userInfo={userInfo} setUserInfo={setUserInfo} setFirstCreate={setFirstCreate} setRestartQuizId={setRestartQuizId} />
      <Header_bottom
        quiz={false}
      />
      <WarningModal
        show={err.hasError}
        setError={(flag) => setError(flag)}
        title={err.title}
        message={err.message}
        onHide={handleClose}
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