import React, { useState } from "react";
import styles from "./CSS/Quiz_create_main.module.css";

const MainInfo = ({ info, handlers }) => {
  const { title, description } = info;
  const { setTitle, setDescription, handleThumbnailChange } = handlers;

  return (
    <div className={styles['quiz-create-main']}>
      <div className={styles['title-section']}>
        <p htmlFor="title" className={styles['p-box']}>제목</p>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder=""
        />
      </div>

      <div className={styles['description-section']}>
        <p htmlFor="description" className={styles['p-box']}>설명</p>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder=""
        />
      </div>
      <div className={styles['thumbnail-section']}>
        <p htmlFor="thumbnail" className={styles['p-box']}>썸네일(선택)</p>
        <div className={styles['thumbnail-upload']}>
          <input type="file" id="thumbnail" onChange={handleThumbnailChange} hidden />
          <button type="button" onClick={() => document.getElementById("thumbnail").click()}>
            +
          </button>
        </div>
      </div>
    </div>
  );
};


export default MainInfo;