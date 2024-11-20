import React, {useEffect, useRef} from 'react';
import YouTube from "react-youtube";

// 프롭스의 onVideoLoad 는 로딩바 시작하기위한 함수라서
// 형쓸꺼에는 다른 함수 넣거나 프롭스로 안넘겨도됨
function YouTubePlayer({songURL,startTime,endTime,onVideoLoad,volume}) {
    console.log(startTime)
    const src=songURL ? (songURL.split('v=')[1]).split('&')[0] : "";
    const playerRef=useRef(null);
    const opts = {
        height: '390', // 비디오 크기
        width: '640',
        playerVars: {
            autoplay: 1, // 자동 재생
            start: startTime, // 시작 시간 (초 단위), 기본값 0
            end: endTime || undefined, // 종료 시간 (초 단위), 기본값 없음
            rel: 0, // 관련 동영상 표시 비활성화
        },
    };

    // YouTube Player 초기화 후 객체 저장
    const handlePlayerReady = (event) => {
        playerRef.current = event.target; // Player 객체 저장
        playerRef.current.seekTo(startTime, true);
        // 이부분은 로딩바 실행 함수이므로 필수는 아님
        if (onVideoLoad) {
            onVideoLoad(); // 프롭스로 전달된 함수 호출
        }
        // 초기 비디오 로딩시 볼륨값 설정
        if (volume >= 0 && volume <= 100) {
            playerRef.current.unMute();
            playerRef.current.setVolume(volume); // 볼륨 설정 (0~100)
        }
    };

    // 프롭스 기반 볼륨 업데이트
    // 상위 컴포넌트에서 넘겨주는 props인 volume state와 setVolume state,
    // 이때 volume 은 0이상 100이하의 정수값이어야함
    useEffect(() => {
        if (playerRef.current && volume >= 0 && volume <= 100) {
            playerRef.current.setVolume(volume); // 볼륨 설정 (0~100)
        }
    }, [volume]); // volume이 변경될 때마다 실행

    // style={{ display: 'none' }}
    // visible : hidden 은 공간은 차지하지만 화면에는 안보이고, display: none은 공간도 차지하지 않고 화면에도 안보임
    return <div style={{ display: 'none' }}>
        <YouTube
            videoId={src}
            opts={opts}
            onReady={handlePlayerReady} // 비디오 재생이 준비되면 실행할 함수
        />
    </div>
}

export default YouTubePlayer;