import React, { useState } from "react";
import "./CSS/Quiz_create_mode.css"

const ModeSelection = ({ mode, handleModeSelect }) => {
    return (
      <div className="mode-selection">
        <div
          className={`mode-button mode-button-basic ${mode === 1 ? "selected" : ""}`}
          onClick={() => handleModeSelect(1)}
        >
          <h2>기본</h2>
          {/* <p></p> */}
        </div>
        <div
          className={`mode-button mode-button-giant ${mode === 2 ? "selected" : ""}`}
          onClick={() => handleModeSelect(2)}
        >
          <h2>AI 악기 분리</h2>
          {/* <p></p> */}
        </div>
      </div>
    );
  };

export default ModeSelection;