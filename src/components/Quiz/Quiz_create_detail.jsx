import React, { useState, useRef, useEffect } from 'react';
import styles from './CSS/Quiz_create_detail.module.css'
import playButton from '../../img/music_play_button.svg'
import pauseButton from '../../img/music_pause_button.svg'

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
    newHints[index] = e.target.value;
    setLocalHints(newHints);
    onUpdateHints(newHints);
  };

  const handleDelete = (index) => {
    const newHints = hints.filter((_, i) => i !== index);
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
            <span className={styles['hint-type']}>{hintSetting[index].text}</span>
            <input
              type="text"
              value={localHints[index] || ''}
              onChange={(e) => handleInputChange(e, index)}
              className={styles['input-square-white']}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

const TimeAdjuster = ({ startTime, onUpdateTime, maxTime }) => {
  const [time, setTime] = useState(startTime || 0);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const hours = Math.floor(mins / 60);
    const displayMins = mins % 60;
    return `${hours > 0 ? String(hours).padStart(2, '0') + ':' : ''}${String(displayMins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSliderChange = (e) => {
    const newTime = Number(e.target.value);
    if (newTime <= maxTime) {
      setTime(newTime);
      onUpdateTime(newTime);
    }
  };

  const adjustTime = (timeOffset) => {
    const newTime = Math.max(0, time + timeOffset);
    if (newTime <= maxTime) {
      setTime(newTime);
      onUpdateTime(newTime);
    }
    else {
      setTime(maxTime);
      onUpdateTime(maxTime);
    }
  };

  return (
    <div className={styles["time-adjuster-container"]}>
      <div className={styles["slider-section"]}>
        <label className={styles["seting-label"]}>재생 설정</label>
        <input
          type="range"
          min="0"
          max={maxTime}
          value={time}
          onChange={handleSliderChange}
          className={styles["option-timebar"]}
        />
        <div className={styles["slider-labels"]}>
          <span>0</span>
          <span style={{ marginLeft: 'calc(240 / 1920 * var(--root--width))' }}>Max</span>
        </div>
      </div>

      <div className={styles["time-display"]}>
        <label>시작시간</label>
        <div className={styles["time"]}>{formatTime(time)}</div>
      </div>

      <div className={styles["adjust-buttons"]}>
        {[1, 5, 10, 30].map((val) => (
          <button key={val} onClick={() => adjustTime(val)}>{`+${val}`}</button>
        ))}
        {[1, 5, 10, 30].map((val) => (
          <button key={-val} onClick={() => adjustTime(-val)}>{`-${val}`}</button>
        ))}
      </div>
    </div>
  );
};

const MusicPlayer = ({ startTime, instrumentId, card }) => {
  const audioRef = useRef(null);
  const playerRef = useRef(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    if (instrumentId === 0 && window.YT) {
      loadYouTubePlayer();
    } else if (instrumentId === 0) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        loadYouTubePlayer();
      };
    }

    // Cleanup function
    return () => {
      if (playerRef.current && instrumentId === 0) {
        playerRef.current.destroy();
      }
    };
  }, [instrumentId]);

  const loadYouTubePlayer = () => {
    const videoId = card.quizUrl.split('v=')[1];
    playerRef.current = new window.YT.Player('youtube-player', {
      videoId: videoId,
      events: {
        onReady: (event) => {
          // 플레이어가 준비되었을 때 시작 시간만 설정하고 재생은 하지 않음
          setPlayerReady(true);
          if (startTime > 0) {
            event.target.cueVideoById({
              videoId: videoId,
              startSeconds: startTime
            });
          }
        },
      },
      playerVars: {
        autoplay: 0, // 자동 재생 비활성화
        controls: 0,
        start: startTime,
        mute: 0,
        playsinline: 1
      }
    });
  };

  const handlePlay = async () => {
    if (instrumentId === 0 && playerRef.current && playerReady) {
      playerRef.current.seekTo(startTime);
      playerRef.current.playVideo();
      setIsPlaying(true);
    } else if (instrumentId !== 0) {
      try {
        const response = await fetch(`http://localhost:8080/GCP/DemucsSong/play?songId=${card.songId}&instrumentId=${instrumentId}`, {
          method: 'GET',
          headers: {
            'accept': '*/*'
          }
        });
        if (response.ok) {
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          setIsPlaying(true);
        } else {
          console.error('Failed to fetch audio file');
        }
      } catch (error) {
        console.error('Error fetching audio file:', error);
      }
    }
  };

  const handleAudioPlay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = startTime;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (instrumentId === 0 && playerRef.current && playerReady) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
    } else if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className={styles['music-play-container']}>
      <label className={styles["seting-label"]}>미리 듣기</label>
      {instrumentId === 0 && (
        <div id="youtube-player" style={{ display: 'none' }}></div>
      )}
      {instrumentId !== 0 && audioUrl && (
        <audio ref={audioRef} src={audioUrl} />
      )}
      <button 
        className={styles['card-play-btn']} 
        onClick={isPlaying ? handlePause : handlePlay}
        disabled={instrumentId === 0 && !playerReady}
      >
        {isPlaying ? (
          <img src={pauseButton} alt="Pause" className={styles['icon-img']} />
        ) : (
          <img src={playButton} alt="Play" className={styles['icon-img']} />
        )}
      </button>
      {audioUrl && !isPlaying && instrumentId !== 0 && (
        <button onClick={handleAudioPlay}>Start from {startTime}s</button>
      )}
    </div>
  );
};


const QuizCreateDetail = ({ info, handlers }) => {
  const { card, hintSetting, token, instrumentId } = info;
  const { setIsModalOpen, setSelectedCardIndex, handleUpdateAnswers, handleUpdateHints, handleUpdateStartTime } = handlers;

  // temporary answers, hints, time until "complete" button click
  const [localAnswers, setLocalAnswers] = useState(card.answers);
  const [localHints, setLocalHints] = useState(card.hints);
  const [localTime, setLocalTime] = useState(card.startTime);

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCardIndex(null);
  };

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
    const seconds = localTime % 60;

    // hintDTOList 
    const hintDTOList = hintSetting.map((setting, index) => ({
      hintStateId: setting.id, // Use setting.id for hintStateId
      hintText: localHints[index] || "" // Use localHints[index] or an empty string if unavailable
    }));

    const hasEmptyHint = hintDTOList.some(hint => hint.hintText === "");
    if (hasEmptyHint) {
      alert("모든 힌트는 비어 있을 수 없습니다.");
      return;
    }

    try {
      // 1. Start time setting API
      const startTimeResponse = await fetch(`http://localhost:8080/song/youtube/${card.quizRelationId}/startTime`, {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          hour: hours,
          minute: minutes,
          second: seconds
        }),
      });
      if (!startTimeResponse.ok) {
        throw new Error('Failed to set start time');
      }

      // 2. Hint setting API
      const hintResponse = await fetch(`http://localhost:8080/song/youtube/${card.quizRelationId}/hint`, {
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
      const answerResponse = await fetch(`http://localhost:8080/song/youtube/${card.quizRelationId}/answers`, {
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
          <TimeAdjuster startTime={localTime} onUpdateTime={setLocalTime} maxTime={card.maxTime} />
          <MusicPlayer startTime={localTime} instrumentId={instrumentId} card={card} />
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