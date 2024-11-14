import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import styles from './CSS/Sound_wave_player.module.css';
import playButton from '../../img/music_play_button.svg'
import pauseButton from '../../img/music_pause_button.svg'

function SoundWavePlayer({ songId, onClose, token }) {
  const waveformsRef = useRef([]);
  const waveSurfersRef = useRef([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentInstrument, setCurrentInstrument] = useState(1); // Default instrumentId to play
  const [currentTime, setCurrentTime] = useState('00:00:00');
  const instrumentIds = [1, 2, 3, 4];
  const instrumentLabels = { 1: '보컬', 2: '베이스', 3: '반주', 4: '드럼' }; // Map instrument IDs to labels

  useEffect(() => {
    const isSeekingRef = { current: false };

    instrumentIds.forEach((instrumentId, index) => {
      // Create WaveSurfer instance
      const waveSurfer = WaveSurfer.create({
        container: waveformsRef.current[index],
        waveColor: '#ddd',
        progressColor: '#555',
        responsive: true,
        height: 80,
        barWidth: 1,
        cursorWidth: 2,
        cursorColor: '#ffffff',
      });

      // Store instance
      waveSurfersRef.current[index] = waveSurfer;

      // Attach 'seek' event listener immediately
      waveSurfer.on('seeking', (currentTime) => {
        console.log('test');
        if (isSeekingRef.current) return;
        isSeekingRef.current = true;

        // Update current time display
        setCurrentTime(new Date(currentTime * 1000).toISOString().substr(11, 8));
        isSeekingRef.current = false;
      });

      // Fetch and load audio
      fetch(`http://localhost:8080/GCP/DemucsSong/play?songId=${songId}&instrumentId=${instrumentId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: '*/*',
        },
      })
        .then((response) => response.blob())
        .then((blob) => {
          const audioUrl = URL.createObjectURL(blob);
          waveSurfer.load(audioUrl);
        })
        .catch((error) => console.error(`Error loading audio for instrument ${instrumentId}:`, error));
    });

    // dynamic waveSuffer height
    const updateWaveSurferHeight = (entries) => {
      const windowHeight = window.innerHeight;
      const newHeight = Math.floor(windowHeight * (90 / 1080));
  
      waveSurfersRef.current.forEach(waveSurfer => {
        if (waveSurfer) {
          waveSurfer.setOptions({ height: newHeight });
        }
      });
    };
  
    // ResizeObserver setting
    const resizeObserver = new ResizeObserver(updateWaveSurferHeight);
  
    const container = document.querySelector(`.${styles.container}`);
    if (container) {
      resizeObserver.observe(container);
    }

    // Cleanup function
    return () => {
      waveSurfersRef.current.forEach((waveSurfer) => {
        if (waveSurfer) waveSurfer.destroy();
      });
      resizeObserver.disconnect();
    };
  }, [songId]);

  // on play-button click
  const handlePlayPause = () => {
    let anyPlaying = false;
    waveSurfersRef.current.forEach((waveSurfer, index) => {
      if (waveSurfer) {
        if (waveSurfer.isPlaying()) {
          waveSurfer.pause();
        } else {
          waveSurfer.setVolume(index === currentInstrument - 1 ? 1 : 0);
          waveSurfer.play();
          anyPlaying = true;
        }
      }
    });
    setIsPlaying(anyPlaying);
  };

  useEffect(() => {
    const isSeekingRef = { current: false };

    waveSurfersRef.current.forEach((waveSurfer, index) => {
      if (waveSurfer) {
        waveSurfer.on('seeking', (currentTime) => {
          if (isSeekingRef.current) return;
          isSeekingRef.current = true; // seeking

          waveSurfersRef.current.forEach((ws) => {
            if (ws) ws.seekTo(currentTime / ws.getDuration());
          });

          // seeking end
          setTimeout(() => {
            isSeekingRef.current = false;
          }, 100); // 100ms delay
        });
      }
    });
  }, []);

  useEffect(() => {
    // Update progress color for each instrument based on currentInstrument
    waveSurfersRef.current.forEach((waveSurfer, index) => {
      if (waveSurfer) {
        // selected instrument color = cyan, other = basic
        waveSurfer.setOptions({
          waveColor: index === currentInstrument - 1 ? '#00FFD9' : '#555',
          progressColor: index === currentInstrument - 1 ? '#008F7A' : '#555'
        });
      }
    });
    const waveSurfer = waveSurfersRef.current[currentInstrument - 1];
    if (waveSurfer) {
      const updateCurrentTime = () => {
        const time = waveSurfer.getCurrentTime();
        setCurrentTime(new Date(time * 1000).toISOString().substr(11, 8));
      };

      waveSurfer.on('audioprocess', updateCurrentTime);

      // Clean up audioprocess listener on unmount or when instrument changes
      return () => {
        waveSurfer.un('audioprocess', updateCurrentTime);
      };
    }
  }, [currentInstrument]);

  const handleInstrumentChange = (instrumentId) => {
    setCurrentInstrument(instrumentId);
    const selectedWaveSurfer = waveSurfersRef.current[instrumentId - 1];

    // syncronize time with other WaveSurfer
    const syncTime = selectedWaveSurfer.getCurrentTime();
    waveSurfersRef.current.forEach((waveSurfer, index) => {
      if (waveSurfer) {
        waveSurfer.setVolume(index === instrumentId - 1 ? 1 : 0);
        waveSurfer.seekTo(syncTime / waveSurfer.getDuration()); // syncronize
      }
    });
  };

  return (
    <div className={styles['modal-overlay']}>
      <div className={styles.container}>
        <span className={styles['preview-button']}>미리 듣기</span>
        <div className={styles.controls}>
          <span className={styles['play-text']}>재생</span>
          <button className={styles['play-button']} onClick={handlePlayPause}>
            {isPlaying ? (
              <img src={pauseButton} alt="Pause" className={styles['icon-img']} />
            ) : (
              <img src={playButton} alt="Play" className={styles['icon-img']} />
            )}
          </button>
          <div className={styles['time-display']}>{currentTime}</div>
        </div>
        {instrumentIds.map((instrumentId, index) => (
          <div key={instrumentId} className={styles['waveform-section']} onClick={() => handleInstrumentChange(instrumentId)}>
            <div className={styles['waveform-container']}>
              <span className={styles['instrument-text']}>{instrumentLabels[instrumentId]}</span>
              <div ref={(el) => (waveformsRef.current[index] = el)} className={styles.waveform}></div>
            </div>
          </div>
        ))}
        <button className={styles['close-button']} onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}

export default SoundWavePlayer;