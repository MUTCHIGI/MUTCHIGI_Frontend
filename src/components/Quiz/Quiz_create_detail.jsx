import React, { useState, useRef, useEffect } from 'react';
import styles from './CSS/Quiz_create_detail.module.css'
import playButton from '../../img/music_play_button.svg'
import pauseButton from '../../img/music_pause_button.svg'
import YouTube from "react-youtube";
import { map } from 'sockjs-client/lib/transport-list';

const AnswerInput = ({ answers, onUpdateAnswers }) => {
  const [currentInputValue, setCurrentInputValue] = useState('');
  const [currentEditValue, setCurrentEditValue] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setCurrentEditValue(answers[index]);
  };

  const handleEditChange = (e) => {
    setCurrentEditValue(e.target.value);
  };

  const handleInputChange = (e) => {
    setCurrentInputValue(e.target.value);
  };

  const handleEditKeyDown = (e, index) => {
    if (e.key === 'Enter' && currentEditValue.trim() !== '') {
      const newAnswers = answers.map((ans, i) =>
        i === index ? currentEditValue.trim() : ans
      );
      onUpdateAnswers(newAnswers);
      setEditingIndex(null); // Edit mode 종료
      setCurrentEditValue('');
    }
  };

  const handleEndEdit = (index) => {
    if (currentEditValue.trim() !== '') {
      const newAnswers = answers.map((ans, i) =>
        i === index ? currentEditValue.trim() : ans
      );
      onUpdateAnswers(newAnswers);
      setEditingIndex(null); // Edit mode 종료
      setCurrentEditValue('');
    }
  };

  const handleDelete = (index) => {
    const newAnswers = answers.filter((_, i) => i !== index);
    onUpdateAnswers(newAnswers);
  };

  const handleAddAnswer = (e) => {
    if (e.key === 'Enter' && currentInputValue.trim() !== '') {
      onUpdateAnswers([...answers, currentInputValue.trim()]);
      setCurrentInputValue('');
    }
  };

  return (
    <div className={styles["answer-container"]}>
      <div className={styles["input-row"]}>
        <div className={styles["seting-label"]}>정답</div>
        <input
          className={styles['input-square-border']}
          type="text"
          placeholder=""
          value={currentInputValue}
          onChange={handleInputChange}
          onKeyDown={(e) => handleAddAnswer(e)}
        />
      </div>
      <div className={styles["answer-list"]}>
        {answers.map((ans, index) => (
          <div key={index} className={styles["answer-item"]}>
            {editingIndex === index ? (
              <div className={styles['answer-edit']}>
                <input
                  type="text"
                  value={currentEditValue}
                  onChange={handleEditChange}
                  onKeyDown={(e) => handleEditKeyDown(e, index)}
                  className={styles['answer-edit-input']}
                  autoFocus
                />
                <button
                  className={styles["check-btn"]}
                  onClick={() => handleEndEdit(index)}
                >
                  ✓
                </button>
              </div>
            ) : (
              <>
                <span>{ans}</span>
                <button
                  className={styles["edit-btn"]}
                  onClick={() => handleEditClick(index)}
                >
                  ✎
                </button>
                <button
                  className={styles["delete-btn"]}
                  onClick={() => handleDelete(index)}
                >
                  X
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const HintInput = ({ hints, onUpdateHints, maxHintNum, hintSetting }) => {
  const [localHints, setLocalHints] = useState(hints);

  const handleInputChange = (e, index) => {
    const newHints = [...localHints];
    if (newHints[index]) {
      // 기존 힌트가 있는 경우 값만 업데이트
      newHints[index].hintText = e.target.value;
    } else {
      // 새로운 힌트를 생성하여 추가
      newHints[index] = {
        hintId: hintSetting[index].id, // ID는 유니크하게 설정
        hintTime: "00:00:00", // 기본 값
        hintType: hintSetting[index].text, // 기본 값
        hintText: e.target.value, // 입력값
      };
    }
    setLocalHints(newHints);
    onUpdateHints(newHints);
  };

  return (
    <div className={styles["hint-container"]}>
      <div className={styles["input-row"]}>
        <div className={styles["seting-label"]}>힌트</div>
      </div>
      <div className={styles["hint-list"]}>
        {Array.from({ length: maxHintNum }).map((_, index) => (
          <div key={index} className={styles["hint-item"]}>
            <span className={styles["hint-type"]}>
              {hintSetting[index]?.text || `Hint ${index + 1}`}
            </span>
            <input
              type="text"
              value={localHints[index]?.hintText || ""}
              onChange={(e) => handleInputChange(e, index)}
              className={styles["input-square-white"]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

function YouTubePlayer({ card, songURL, startTime, volume, instrumentId, token, setStartTime }) {
  const playerRef = useRef(null);
  const [playerHeight, setPlayerHeight] = useState('390'); // Default height
  const [playerWidth, setPlayerWidth] = useState('640'); // Default width
  const intervalRef = useRef(null); // Store interval ID to manage cleanup
  const [initialStartTime, setInitialStartTime] = useState(startTime);
  const audioRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isYoutubeMuted, setIsYoutubeMuted] = useState(false);

  // audio 

  useEffect(() => {
    const initializePlayerOrFetchAudio = async () => {
      if (instrumentId !== 0) {
        try {
          const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/GCP/DemucsSong/play?songId=${card.songId}&instrumentId=${instrumentId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'accept': '*/*'
            }
          });
          if (response.ok) {
            const blob = await response.blob();
            if (blob.size > 0) {
              const url = URL.createObjectURL(blob);
              setAudioUrl(url);
              if (audioRef.current) {
                audioRef.current.src = url;
              }
            }
          }
        } catch (error) {
          console.error('Error fetching audio file:', error);
        }
        setIsYoutubeMuted(true); // Mute YouTube
      }
    };

    initializePlayerOrFetchAudio();
  }, [card.songId, instrumentId]);


  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.volume = 0.5;
    }
  }, [audioUrl]);

  // youtube
  useEffect(() => {
    const updatePlayerSize = () => {
      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const newHeight = Math.floor(windowHeight * 0.27); // Adjust multiplier as needed
      const newWidth = Math.floor(windowWidth * 0.27); // Adjust multiplier as needed
      setPlayerHeight(newHeight.toString());
      setPlayerWidth(newWidth.toString());
    };
    updatePlayerSize();
    window.addEventListener('resize', updatePlayerSize);
    return () => {
      window.removeEventListener('resize', updatePlayerSize);
    };
  }, []);

  const opts = {
    height: playerHeight,
    width: playerWidth,
    playerVars: {
      autoplay: 1,
      start: 0,
      rel: 0,
    },
  };

  const handlePlayerReady = (event) => {
    playerRef.current = event.target;
    if (volume >= 0 && volume <= 100) {
      playerRef.current.setVolume(volume);
    }
    console.log(isYoutubeMuted)
    if (isYoutubeMuted)
    {
      playerRef.current.mute(isYoutubeMuted);
    }
    playerRef.current.seekTo(initialStartTime, true);
    playerRef.current.pauseVideo();
    intervalRef.current = setInterval(() => {
      const currentTime = playerRef.current.getCurrentTime();
      setStartTime(currentTime);
    }, 10); // Log every second
  };

  useEffect(() => {
    // Cleanup on component unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (playerRef.current && volume >= 0 && volume <= 100) {
      playerRef.current.setVolume(volume);
    }
  }, [volume]);

  const handleStateChange = (event) => {
    if (event.data === 1) {
      if (audioRef.current) {
        audioRef.current.play();
        audioRef.current.currentTime = playerRef.current.getCurrentTime();
      }
    } else if (event.data === 2) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
  };

  return (
    <>
      <div className={styles.container}>
        <YouTube
          videoId={songURL.split('v=')[1]?.split('&')[0]}
          opts={opts}
          onReady={handlePlayerReady}
          onStateChange={handleStateChange}
        />
      </div>
      {instrumentId !== 0 && audioUrl && (
        <audio ref={audioRef} src={audioUrl} />
      )}
    </>
  );
}


const TimeAdjuster = ({ card, startTime, instrumentId, token, onUpdateTime }) => {

  const formatTime = (seconds) => {
    const totalMilliseconds = seconds * 1000;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const hours = Math.floor(mins / 60);
    const displayMins = mins % 60;
  
    return `${hours > 0 ? String(hours).padStart(2, '0') + ':' : ''}` +
           `${String(displayMins).padStart(2, '0')}:` +
           `${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    console.log("starTime is" , startTime)
  }, [startTime]);

  return (
    <div className={styles["time-adjuster-container"]}>
      <div className={styles["slider-section"]}>
        <label className={styles["seting-label-big"]}>시작 시간 설정</label>
        <div className={styles["time"]}>{formatTime(startTime)}</div>
      </div>
      <div className={styles["time-display"]}>
        <YouTubePlayer
          card={card}
          songURL={card.quizUrl}
          startTime={startTime}
          volume={50}
          instrumentId={instrumentId}
          token={token}
          setStartTime={onUpdateTime}
        />
      </div>
    </div>
  );
};

const QuizCreateDetail = ({ info, handlers }) => {
  const { card, hintSetting, token, instrumentId } = info;
  const { setIsModalOpen, setSelectedCardIndex, handleUpdateAnswers, handleUpdateHints, handleUpdateStartTime } = handlers;

  // temporary answers, hints, time until "complete" button click
  const [localAnswers, setLocalAnswers] = useState(card.answers);
  const [localHints, setLocalHints] = useState(card.hints);
  const [localTime, setLocalTime] = useState(card.startTime === -1 ? 0 : card.startTime);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCardIndex(null);
  };

  console.log("qsid : ", card.quizRelationId);
  const handleSave = async () => {
    // execption
    if (localAnswers.length > 20) {
      alert("Answer는 20개를 초과할 수 없습니다.");
      return;
    }

    if (localAnswers.length === 0) {
      alert("Answer는 최소 1개 이상 필요합니다.");
      return;
    }

    // Start time
    const hours = Math.floor(localTime / 3600);
    const minutes = Math.floor((localTime % 3600) / 60);
    const seconds = Math.floor(localTime % 60);

    // hintDTOList 
    const hintDTOList = hintSetting.map((setting, index) => ({
      hintStateId: setting.id, // Use setting.id for hintStateId
      hintText: localHints[index]?.hintText || "" // Use localHints[index] or an empty string if unavailable
    }));

    const hasEmptyHint = hintDTOList.some(hint => hint.hintText === "");
    if (hasEmptyHint) {
      alert("모든 힌트는 비어 있을 수 없습니다.");
      return;
    }

    try {
      // 1. Start time setting API
      const startTimeResponse = await fetch(`${import.meta.env.VITE_SERVER_IP}/song/youtube/${card.quizRelationId}/startTime`, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          hour: hours,
          minute: minutes,
          second: seconds,
        }),
      });
      if (!startTimeResponse.ok) {
        throw new Error('Failed to set start time');
      }

      // 2. Hint setting API
      const hintResponse = await fetch(`${import.meta.env.VITE_SERVER_IP}/song/youtube/${card.quizRelationId}/hint`, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(hintDTOList),
      });
      if (!hintResponse.ok) {
        throw new Error('Failed to set hints');
      }

      // 3. Answer setting API
      const answerResponse = await fetch(`${import.meta.env.VITE_SERVER_IP}/song/youtube/${card.quizRelationId}/answers`, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(localAnswers),
      });
      if (!answerResponse.ok) {
        throw new Error('Failed to set answers');
      }

      // update state & close modal
      handleUpdateAnswers(localAnswers);
      handleUpdateHints(localHints);
      handleUpdateStartTime(localTime);
      closeModal();

    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className={styles["modal-overlay"]}>
      <div className={styles["modal-content"]} onClick={(e) => e.stopPropagation()}>
        <div className={styles["quiz-seting-left"]}>
          <AnswerInput answers={localAnswers} onUpdateAnswers={setLocalAnswers} />
          <HintInput hints={localHints} onUpdateHints={setLocalHints} maxHintNum={hintSetting.length} hintSetting={hintSetting} />
        </div>
        <div className={styles['quiz-seting-right']}>
          <TimeAdjuster
            card={card}
            startTime={localTime}
            instrumentId={instrumentId}
            token={token}
            onUpdateTime={setLocalTime}
          />
        </div>
        <div className={styles["btn-container"]}>
          <button
            className={styles["close-btn"]}
            style={{ borderRight: "1px solid #000000" }}
            onClick={closeModal}
          >
            취소
          </button>
          <button className={styles["close-btn"]} onClick={handleSave}>
            완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCreateDetail