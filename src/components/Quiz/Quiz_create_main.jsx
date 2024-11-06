import React, { useState } from "react";
import styles from "./CSS/Quiz_create_main.module.css";

const MainInfo = ({ info, handlers }) => {
  const { title, description, thumbnail } = info;
  const { setTitle, setDescription, setThumbnail } = handlers;
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      // Check file type
      if (file.type !== "image/png") {
        alert("PNG 파일만 업로드 가능합니다.");
        return;
      }

      // Check file dimensions
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width > 1920 || img.height > 1080) {
          alert("1920x1080 이하의 이미지만 업로드 가능합니다.");
        } else {
          setThumbnail(file);
          setThumbnailPreview(img.src);
        }
      };
    }
  };

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
          {!thumbnailPreview ? (
            <button type="button" onClick={() => document.getElementById("thumbnail").click()}>
              +
            </button>
          ) : (
            <img src={thumbnailPreview} alt="thumbnail preview" className={styles['thumbnail-image']} />
          )}
        </div>
      </div>
    </div>
  );
};


export default MainInfo;