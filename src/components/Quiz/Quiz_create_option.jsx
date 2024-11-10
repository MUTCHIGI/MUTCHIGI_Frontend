import React, { useState } from 'react';
import styles from './CSS/Quiz_option.module.css'

const OptionSelection = ({ info, handlers }) => {
  const { timeLimit, hints, instrument, mode } = info;
  const { setTimeLimit, setHints, setInstrument } = handlers;


  const handleTimeChange = (e) => {
    const value = Number(e.target.value);
    setTimeLimit(value);
  };

  const handleInputChange = (e) => {
    const value = Number(e.target.value);
    if (value >= 0 && value <= 180) {
      setTimeLimit(value);
    }
  };

  const addHint = () => {
    if (hints.length < 3) {
      setHints([...hints, { id: hints.length + 1, text: '', time: '0초 후' }]);
    }
  };

  const updateHint = (id, text, time) => {
    setHints((prevHints) =>
      prevHints.map((hint) =>
        hint.id === id ? { ...hint, text: text, time: time } : hint
      )
    );
  };

  const removeHint = (id) => {
    setHints((prevHints) =>
      prevHints
        .filter((hint) => hint.id !== id) // delete selected hint
        .map((hint, index) => ({
          ...hint,
          id: index + 1, // reallocate id with remain hint list
        }))
    );
  };

  const InstrumentSelect = ({ instrument, setInstrument }) => {
    const instruments = [
      { id: 1, name: '보컬' },
      { id: 2, name: '베이스' },
      { id: 3, name: '반주' },
      { id: 4, name: '드럼' },
    ];

    return (
      <div className={styles["instrument-selection"]}>
        {instruments.map((instr) => (
          <React.Fragment key={instr.id}>
            <label
              className={styles['instrument-option']}
              style={instr.name === '베이스' ? { width: 'calc(80 / 1920 * var(--root--width))' } : {}}
            >
              <span className={styles["instrument-name"]}>
                {instr.name}
              </span>
            </label>
            <input
              className={styles["instrument-radio"]}
              name="instrument"
              value={instr.id}
              checked={instrument === instr.id}
              onChange={(e) => setInstrument(parseInt(e.target.value, 10))}
              type='radio'
            />
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className={styles["music-settings-container"]}>
      <div className={styles["option-section-time"]}>
        <span className={styles["option-timeLimit"]}>제한시간</span>
        <input className={styles['option-timebar']}
          type="range"
          min="0"
          max="360"
          value={timeLimit}
          onChange={handleTimeChange}
        />
        <div className={styles["option-timetext"]}>
          <span>0</span>
          <span style={{ marginLeft: 'calc(245 / 1920 * var(--root--width))' }}>Max</span>
        </div>
        <input
          type="number"
          value={timeLimit}
          onChange={handleInputChange}
          className={styles["option-time-input"]}
        />
        <span className={styles['option-second']}>초</span>
      </div>
      <div className={styles["option-section-hint"]}>
        <div className={styles["option-hint-top"]}>
          <span className={styles['option-white-box']}>힌트</span>
          <button onClick={addHint} className={styles["add-hint-button"]}>+</button>
        </div>
        <div className={styles['option-hint-list']}>
          {(Array.isArray(hints) ? hints : []).map((hint, index) => (
            <div
              key={hint.id}
              className={styles["option-hint"]}
              style={{ gridRow: index + 1 }}
            >
              <span className={styles["hint-number"]}>
                {index + 1}
              </span>
              <input className={styles["hint-description"]}
                type="text"
                id="title"
                value={hint.text}
                onChange={(e) => updateHint(hint.id, e.target.value, hint.value)}
                placeholder="힌트 유형"
              />
              <select
                value={hint.time}
                onChange={(e) => updateHint(hint.id, hint.text, e.target.value)}
                className={styles["hint-select"]}
              >
                {Array.from({ length: timeLimit / 5 }, (_, i) => (
                  <option key={i} value={`${(i) * 5}초 후`}>
                    {(i) * 5}초 후
                  </option>
                ))}
              </select>
              <button onClick={() => removeHint(hint.id)} className={styles["hint-remove-button"]}>
                X
              </button>
            </div>
          ))}
        </div>
      </div>
      {mode === 2 && (
        <div className={styles["option-ai"]}>
          <span className={`${styles['option-white-box']} ${styles['option-select-instrument']}`}>악기 선택</span>
          <InstrumentSelect instrument={instrument} setInstrument={setInstrument} />
        </div>
      )}
    </div>
  );
};

export default OptionSelection;