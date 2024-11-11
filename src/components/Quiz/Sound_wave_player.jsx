import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import styles from './CSS/Sound_wave_player.module.css';
import playButton from '../../img/music_play_button.svg'
import pauseButton from '../../img/music_pause_button.svg'

function SoundWavePlayer({ songId, instrumentId, onClose, token }) {
  const waveformRef = useRef(null);
  const waveSurferRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00:00');

  useEffect(() => {
    if (waveformRef.current) {
      waveSurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#ddd',
        progressColor: '#555',
        responsive: true,
        height: 80,
        barWidth: 1,
        cursorWidth: 2,
        cursorColor: '#ffffff',
      });

      fetch(`http://localhost:8080/GCP/DemucsSong/play?songId=${songId}&instrumentId=${instrumentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*',
        },
      })
        .then((response) => response.blob())
        .then((blob) => {
          const audioUrl = URL.createObjectURL(blob);
          waveSurferRef.current.load(audioUrl);

          waveSurferRef.current.on('audioprocess', () => {
            const time = waveSurferRef.current.getCurrentTime();
            setCurrentTime(new Date(time * 1000).toISOString().substr(11, 8));
          });
        })
        .catch((error) => console.error('Error loading audio:', error));
    }

    return () => waveSurferRef.current.destroy();
  }, [songId, instrumentId]);

  const handlePlayPause = () => {
    waveSurferRef.current.playPause();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles.container}>
        <span className={styles['preview-button']}>미리 듣기</span>
        <div className={styles.controls}>
          <span className={styles['play-text']}>재생</span>
          <button className={styles['play-button']} onClick={handlePlayPause}>
            {isPlaying ?
              <img src={pauseButton} alt="Pause" className={styles['icon-img']} /> :
              <img src={playButton} alt="Play" className={styles['icon-img']} />}
          </button>
          <div className={styles['time-display']}>{currentTime}</div>
        </div>
        <div className={styles['waveform-container']}>
          <div ref={waveformRef} className={styles.waveform}></div>
        </div>
        <button className={styles['close-button']} onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

export default SoundWavePlayer;