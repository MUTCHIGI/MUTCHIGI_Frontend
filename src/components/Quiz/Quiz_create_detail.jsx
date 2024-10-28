import React, { useState } from 'react';
import styles from './CSS/Quiz_create_detail.module.css'

const AnswerInput = ({ answers, onUpdateAnswers }) => {
    const [answer, setAnswer] = useState('');
  
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && answer.trim() !== '') {
        const newAnswers = [...answers, answer.trim()];
        onUpdateAnswers(newAnswers);
        setAnswer('');
      }
    };
  
    const handleDelete = (index) => {
      const newAnswers = answers.filter((_, i) => i !== index);
      onUpdateAnswers(newAnswers);
    };

    return (
        <div className={styles["answer-container"]}>
            <div className={styles["input-row"]}>
                <div className={styles["seting-label"]}>정답</div>
                <input
                    className={styles['input-square-border']}
                    type="text"
                    placeholder=""
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <div className={styles["answer-list"]}>
                {answers.map((ans, index) => (
                    <div key={index} className={styles["answer-item"]}>
                        <span>{ans}</span>
                        <button className={styles["delete-btn"]} onClick={() => handleDelete(index)}>
                            X
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const HintInput = ({ hints, onUpdateHints, maxHintNum }) => {
    const [hint, setHint] = useState('');
  
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && hint.trim() !== '') {
        if (hints.length >= maxHintNum) {
          return;
        }
        const newHints = [...hints, hint.trim()];
        onUpdateHints(newHints);
        setHint('');
      }
    };
  
    const handleDelete = (index) => {
      const newHints = hints.filter((_, i) => i !== index);
      onUpdateHints(newHints);
    };

    return (
        <div className={styles["hint-container"]}>
            <div className={styles["input-row"]}>
                <div className={styles["seting-label"]}>힌트</div>
                <input
                    type="text"
                    placeholder=""
                    className={styles['input-square-white']}
                    value={hint}
                    onChange={(e) => setHint(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <div className={styles["hint-list"]}>
                {hints.map((ans, index) => (
                    <div key={index} className={styles["hint-item"]}>
                        <span>{ans}</span>
                        <button className={styles["delete-btn"]} onClick={() => handleDelete(index)}>
                            X
                        </button>
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
      else
      {
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
                    max="3600"
                    value={time}
                    onChange={handleSliderChange}
                    className={styles["option-timebar"]}
                />
                <div className={styles["slider-labels"]}>
                    <span>0</span>
                    <span style={{ marginLeft: 'calc(240 / 1920 * var(--root--width))'}}>Max</span>
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

const QuizCreateDetail = ({ info, handlers }) => {
    const { card, hintSetting, token } = info;
    const { setIsModalOpen, setSelectedCardIndex, handleUpdateAnswers, handleUpdateHints, handleUpdateStartTime } = handlers;
  
    // temporary answers, hints, time until "complete" button click
    const [localAnswers, setLocalAnswers] = useState(card.answers);
    const [localHints, setLocalHints] = useState(card.hints);
    const [localTime, setLocalTime] = useState(card.startTime);
  
    const closeModal = () => {
      setIsModalOpen(false);
      setSelectedCardIndex(null);
    };
  
    const handleSave = () => {
        // Start time
        const hours = Math.floor(localTime / 3600);
        const minutes = Math.floor((localTime % 3600) / 60);
        const seconds = localTime % 60;

        // hintDTOList 
        const hintDTOList = hintSetting.map((setting, index) => ({
            hour: Math.floor(setting.time / 3600),
            minute: Math.floor((setting.time % 3600) / 60),
            second: setting.time % 60,
            hintType: setting.hintType,
            hintText: localHints[index] || "", // if input.size < hintSetting.length -> empty string
        }));

        fetch(`http://localhost:8080/song/youtube/${card.quizRelationId}/settings`, {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                startTime: {
                    hour: hours,
                    minute: minutes,
                    second: seconds
                },
                answerList: localAnswers,
                hintDTOList: hintDTOList
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            handleUpdateAnswers(localAnswers);
            handleUpdateHints(localHints);
            handleUpdateStartTime(localTime);
            closeModal();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };
  
    return (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className={styles["quiz-seting-left"]}>
            <AnswerInput answers={localAnswers} onUpdateAnswers={setLocalAnswers} />
            <HintInput hints={localHints} onUpdateHints={setLocalHints} maxHintNum={hintSetting.length} />
          </div>
          <div className={styles['quiz-seting-right']}>
            <TimeAdjuster startTime={localTime} onUpdateTime={setLocalTime} />
          </div>
          <button className={styles["close-btn"]} onClick={handleSave}>
            완료
          </button>
        </div>
      </div>
    );
  };

export default QuizCreateDetail