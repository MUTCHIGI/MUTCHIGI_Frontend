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