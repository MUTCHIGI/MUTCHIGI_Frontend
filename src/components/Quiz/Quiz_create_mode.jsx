import React, { useState } from "react";
import styles from "./CSS/Quiz_create_mode.module.css"

const ModeSelection = ({ mode, handleModeSelect }) => {
  return (
    <div className={styles["mode-selection"]}>
      <div
        className={`${styles["mode-button"]} ${styles["mode-button-basic"]} ${mode === 1 ? styles["selected"] : ""}`}
        onClick={() => handleModeSelect(1)}
      >
        <span className={styles["mode-name"]}>기본</span>
      </div>
      <div
        className={`${styles["mode-button"]} ${styles["mode-button-giant"]} ${mode === 2 ? styles["selected"] : ""}`}
        onClick={() => handleModeSelect(2)}
      >
        <span className={styles["mode-name"]}>AI 악기 분리</span>
      </div>
    </div>
  );
};

export default ModeSelection;