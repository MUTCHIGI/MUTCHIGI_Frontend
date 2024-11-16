import React, { startTransition, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CSS/Quiz_create_list_ai.module.css';
import editButton from '../../img/edit_button.svg';
import playButton from '../../img/music_play_button.svg'
import deleteButton from '../../img/delete_button.svg';
import QuizCreateDetail from './Quiz_create_detail';
import PageMove from './Page_move.jsx'
import SoundWavePlayer from './Sound_wave_player.jsx';
import spinner from '../../img/loading.svg'

const QuizCreateListAi = ({ quizId, instrumentId, hintSetting, token }) => {
    // screan setting
    const [currentScreen, setCurrentScreen] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    // selected song info
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cards, setCards] = useState([]);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    // candidates song
    const [selectedItems, setSelectedItems] = useState([]);
    // song search page info
    const [currentPage, setCurrentPage] = useState(1);
    const [inputValue, setInputValue] = useState(currentPage);
    // api info
    const [orderCount, setOrderCount] = useState(0);

    useEffect(() => {
        const fetchHintSetting = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/quiz/${quizId}/hintState`, {
                    method: 'GET',
                    headers: {
                        'Accept': '*/*',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch hint setting');
                }
                const data = await response.json();
                const formattedHintSetting = data.map(hint => {
                    const [hours, minutes, seconds] = hint.hintTime.split(':').map(Number);
                    const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

                    return {
                        id: hint.hintStateId,
                        text: hint.hintType,
                        time: totalSeconds
                    };
                });

                // Update only the `time` property in `hintSetting`
                formattedHintSetting.forEach((formattedHint, index) => {
                    if (hintSetting[index]) {
                        hintSetting[index].time = formattedHint.time;
                    }
                });

                console.log(hintSetting);
            } catch (error) {
                console.error('Error fetching hint setting:', error);
            }
        };

        const fetchData = async () => {
            try {
                if (quizId !== -1) {
                    const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/song/youtube/songList?quizId=${quizId}`, {
                        method: 'GET',
                        headers: {
                            'Accept': '*/*',
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    const formattedCards = await Promise.all(data.map(async (item) => {
                        const maxTimeInSeconds = convertToSeconds(item.songTime);

                        // Fetch answers
                        const answers = await fetchGetApi(`${import.meta.env.VITE_SERVER_IP}/song/youtube/${item.quizSongRelationID}/answers`, token);
                        // Fetch hints
                        const hints = await fetchGetApi(`${import.meta.env.VITE_SERVER_IP}/song/youtube/${item.quizSongRelationID}/hint`, token);

                        return {
                            url: item.playURL,
                            answers: answers,
                            hints: hints.map(hint => ({
                                hintId: hint.hintId,
                                hintTime: convertToSeconds(hint.hintTime),
                                hintType: hint.hintType,
                                hintText: hint.hintText
                            })),
                            startTime: 0,
                            quizRelationId: item.quizSongRelationID,
                            quizUrl: item.playURL,
                            quizThumbnail: item.thumbnailURL,
                            maxTime: maxTimeInSeconds,
                        };
                    }));
                    setCards(formattedCards);
                }
            } catch (error) {
                console.error('Error fetching song list:', error);
            }
        };

        setIsLoading(true);
        fetchHintSetting();
        fetchData();
        getOrderCount();
        setIsLoading(false);
    }, [quizId, token]);

    const convertToSeconds = (timeString) => {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        console.log(hours, minutes, seconds);
        return (hours * 3600) + (minutes * 60) + seconds;
    };

    const switchScreen = (screenNumber) => setCurrentScreen(screenNumber);

    const fetchGetApi = async (url, token) => {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch data from ${url}`);
        }
        return response.json();
    };

    const getOrderCount = async () => {
        try {
            const response = await fetchGetApi(`${import.meta.env.VITE_SERVER_IP}/GCP/userDemcusCount`, token);
            const data = await response.json();
            setOrderCount(data.orderCount);
        } catch (error) {
            console.error("Error fetching current count:", error);
        }
    };


    const confirmCandidate = async () => {
        try {
            const updatedSelectedItems = await Promise.all(
                selectedItems.map(async (item) => {
                    const response = await fetch(
                        `${import.meta.env.VITE_SERVER_IP}/GCP/DemucsSong/SongToQuiz?songIds=${item.songId}&quizId=${quizId}`,
                        {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Accept': '*/*',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({}),
                        }
                    );

                    if (!response.ok) throw new Error('Failed to assign song to quiz');

                    // 응답에서 quizSongRelationId를 추출
                    const [quizSongRelationId] = await response.json();

                    // 새로운 card 형식으로 반환
                    const maxTimeInSeconds = item.maxTime;
                    try {
                        const answers = await fetchGetApi(`${import.meta.env.VITE_SERVER_IP}/song/youtube/${quizSongRelationId}/answers`, token);
                        return {
                            url: item.playURL,
                            answers: answers, // answers succesful
                            hints: [],
                            startTime: 0,
                            songId: item.songId,
                            quizRelationId: quizSongRelationId,
                            quizUrl: item.quizUrl,
                            quizThumbnail: item.quizThumbnail,
                            maxTime: maxTimeInSeconds,
                        };
                    }
                    catch (error) {
                        return {
                            url: item.playURL,
                            answers: [], // on failure answers 초기값으로 빈 배열 설정
                            hints: [],
                            startTime: 0,
                            songId: item.songId,
                            quizRelationId: quizSongRelationId,
                            quizUrl: item.quizUrl,
                            quizThumbnail: item.quizThumbnail,
                            maxTime: maxTimeInSeconds,
                        };
                    }
                })
            );

            // cards에 updatedSelectedItems 추가 및 selectedItems 초기화
            setCards([...cards, ...updatedSelectedItems]);
            setSelectedItems([]);  // ScreenTwo에서 선택 항목 초기화
            switchScreen(1);
        } catch (error) {
            console.error('Error assigning songs to quiz:', error);
        }
    };

    const handleDeleteCard = (index) => {
        fetch(`${import.meta.env.VITE_SERVER_IP}/song/youtube/${cards[index].quizRelationId}/delSong`, {
            method: 'DELETE',
            headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ${token}`, // token을 props나 상태로 전달받아 사용
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setCards(cards.filter((_, i) => i !== index));
                return response.status !== 200 ? response.json() : null;
            })
            .then((data) => {
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    };

    const openModal = (index) => {
        setSelectedCardIndex(index);
        setIsModalOpen(true);
    };

    const handleUpdateAnswers = (newAnswers) => {
        const updatedCards = [...cards];
        updatedCards[selectedCardIndex].answers = newAnswers;
        setCards(updatedCards);
    };

    const handleUpdateHints = (newHints) => {
        const updatedCards = [...cards];
        updatedCards[selectedCardIndex].hints = newHints;
        setCards(updatedCards);
    };

    const handleUpdateStartTime = (newStartTime) => {
        const updatedCards = [...cards];
        updatedCards[selectedCardIndex].startTime = newStartTime;
        setCards(updatedCards);
    }

    const modalHandlers = { setIsModalOpen, setSelectedCardIndex, handleUpdateAnswers, handleUpdateHints, handleUpdateStartTime };

    return (
        <>
            {currentScreen === 1 && (
                <MusicList
                    quizId={quizId}
                    cards={cards}
                    isModalOpen={isModalOpen}
                    isLoading={isLoading}
                    hintSetting={hintSetting}
                    token={token}
                    openModal={openModal}
                    handleDeleteCard={handleDeleteCard}
                    onNavigate={() => switchScreen(2)}
                />
            )}
            {currentScreen === 2 && (
                <SelectedCandidate
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    onComplete={confirmCandidate}
                    onNavigateToSearch={() => switchScreen(3)}
                />
            )}
            {currentScreen === 3 && (
                <SearchPreProcessSong
                    selectedItems={selectedItems}
                    setSelectedItems={setSelectedItems}
                    token={token}
                    instrumentId={instrumentId}
                    onNavigateBack={() => switchScreen(2)}
                    onNavigateToSeparation={() => switchScreen(4)}
                />
            )}
            {currentScreen === 4 && (
                <MusicSeparation
                    orderCount={orderCount}
                    token={token}
                    setOrderCount={setOrderCount}
                    onNavigateBack={() => switchScreen(3)}
                />
            )}
            {isModalOpen && (
                <QuizCreateDetail
                    info={{
                        card: cards[selectedCardIndex],
                        hintSetting: hintSetting,
                        token: token,
                        instrumentId: instrumentId,
                    }}
                    handlers={modalHandlers}
                />
            )}
        </>
    );
};

function MusicList({ quizId, cards, isModalOpen, isLoading, hintSetting, token, openModal, handleDeleteCard, onNavigate }) {
    let navigate = useNavigate();

    const nextStep = async () => {
        const hasInvalidHints = cards.some((card) => {
            return (
                card.hints.length < hintSetting.length || // Not enough hints
                card.hints.some((hint) => hint.trim() === '') // Empty hint string
            );
        });

        if (hasInvalidHints) {
            alert("힌트를 설정하지 않은 항목이 있습니다");
            return; // Prevent the request from being sent
        }

        fetch(`${import.meta.env.VITE_SERVER_IP}/quiz/setReady/${quizId}`, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "*/*",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to upload image");
                }
                navigate('/home');
            })
    };

    return (
        <>
            {isLoading ? (
                <div className={styles["loading-screen"]}>
                    <div className={styles["loading-component"]}>
                        <img
                            src={spinner}
                            style={{ width: '100%', height: '100%' }}
                            alt="Loading Spinner"
                        />
                    </div>
                    <h1 className={styles["loading-title"]}>
                        불러오는 중...
                    </h1>
                </div>
            ) : (
                <div className={`${styles['card-list-container']} ${isModalOpen ? styles['blur'] : ''}`}>
                    <button className={styles['add-button']}>퀴즈 목록</button>
                    <div className={styles['card-grid']}>
                        <div className={styles['card']}>
                            <button className={styles['add-icon']} onClick={onNavigate}>
                                +
                            </button>
                        </div>
                        {cards.map((card, index) => (
                            <div
                                className={styles['card']}
                                key={index}
                                style={{
                                    backgroundImage: `url(${card.quizThumbnail})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundColor: 'gray',
                                }}
                            >
                                <div className={styles['card-content']}>
                                    <div className={styles['card-icons']}>
                                        <button className={styles['card-edit-btn']} onClick={() => openModal(index)}>
                                            <img src={editButton} alt="Edit" className={styles['card-icon-img']} />
                                        </button>
                                        <button
                                            className={styles['card-delete-btn']}
                                            onClick={() => handleDeleteCard(index)}
                                        >
                                            <img src={deleteButton} alt="Delete" className={styles['card-icon-img']} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles["navigation-buttons"]}>
                        <button
                            type="button"
                            onClick={nextStep}
                            className={styles["nav-button"]}
                        >
                            퀴즈 생성
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

function SelectedCandidate({ selectedItems, setSelectedItems, onComplete, onNavigateToSearch }) {
    // const handleDeleteCard = (index) => {
    //     setSelectedItems(selectedItems.filter((_, i) => i !== index));
    // };

    return (
        <div className={styles['card-list-container']}>
            <span className={styles['complete-button']}>선택 목록</span>
            <div className={styles['card-grid']}>
                {selectedItems.map((item, index) => (
                    <div
                        className={styles['card']}
                        key={index}
                        style={{
                            backgroundImage: `url(${item.quizThumbnail})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundColor: 'gray',
                        }}
                    // onClick={() => handleDeleteCard(index)}
                    >
                    </div>
                ))}
            </div>
            <span className={`${styles['navigation-icon']} ${styles['right']}`} onClick={onNavigateToSearch}>
                →
            </span>
            <div className={styles["navigation-buttons"]}>
                <button
                    type="button"
                    onClick={onComplete}
                    className={styles["nav-button"]}
                >
                    음악 추가
                </button>
            </div>
        </div>
    );
}

function SearchPreProcessSong({ selectedItems, setSelectedItems, token, instrumentId, onNavigateBack, onNavigateToSeparation }) {
    const [currentPage, setCurrentPage] = useState(1);
    const [inputValue, setInputValue] = useState(currentPage);
    const [title, setTitle] = useState('');
    const [cards, setCards] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState({ songId: null, instrumentId: null });

    const handlePlayButtonClick = (songId) => {
        setModalData({ songId, instrumentId });
        setIsModalOpen(true);
    };

    const handleSelectItem = (card) => {
        if (!selectedItems.some(selectedItem => selectedItem.songId === card.songId)) {
            setSelectedItems([...selectedItems, card]);
        }
        else {
            setSelectedItems(selectedItems.filter(selectedItem => selectedItem.songId !== card.songId));
        }
    };

    const convertToSeconds = (timeString) => {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        console.log(hours, minutes, seconds);
        return (hours * 3600) + (minutes * 60) + seconds;
    };

    const fetchData = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/GCP/DemucsSong/List?page=${currentPage}&offset=12&songTitle=${encodeURIComponent(title)}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': '*/*',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch data');

            const data = await response.json();
            const formattedData = data.map(song => ({
                url: song.playURL,
                answers: [],
                hints: [],
                startTime: 0,
                quizRelationId: null,
                songId: song.songId,
                quizUrl: song.playURL,
                songName: song.songName,
                quizThumbnail: song.thumbnailURL,
                maxTime: convertToSeconds(song.songTime)
            }));
            setCards(formattedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    return (
        <div className={styles['card-list-container']}>
            <div className={styles["url-input-section"]}>
                <input
                    type="text"
                    placeholder="기존에 변환된 음악을 찾아보세요!"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={styles['url-input']}
                />
                <button className={styles['url-input-button']} onClick={fetchData}>검색</button>
            </div>
            <div className={styles['card-grid']}>
                {cards.map((card, index) => {
                    const isSelected = selectedItems.some(selectedItem => selectedItem.songId === card.songId); // songId로 선택 여부 확인
                    return (
                        <div key={index} style={{ width: '100%' }}>
                            <div
                                className={`${styles['card']} ${isSelected ? styles['highlight-border'] : ''}`}
                                style={{
                                    backgroundImage: `url(${card.quizThumbnail})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    backgroundColor: 'gray',
                                }}
                                onClick={() => handleSelectItem(card)}
                            >
                                <div className={styles['card-content']}>
                                    <div className={styles['card-icons']}>
                                        <button
                                            className={styles['card-play-btn']}
                                            onClick={() => handlePlayButtonClick(card.songId)}
                                        >
                                            <img src={playButton} alt="Play" className={styles['card-icon-img']} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <span className={styles['card-title']}>
                                <span className={styles["scroll-text"]}>{card.songName ? card.songName : 'test'}</span>
                            </span>
                        </div>
                    );
                })}
            </div>
            <span className={`${styles['navigation-icon']} ${styles['left']}`} onClick={onNavigateBack}>
                ←
            </span>
            <span className={`${styles['navigation-icon']} ${styles['right']}`} onClick={onNavigateToSeparation}>
                →
            </span>
            <PageMove
                info={{ currentPage, inputValue }}
                handlers={{ setCurrentPage, setInputValue }}
            />
            {isModalOpen && (
                <SoundWavePlayer
                    songId={modalData.songId}
                    instrumentId={modalData.instrumentId}
                    onClose={() => setIsModalOpen(false)}
                    token={token}
                />
            )}
        </div>
    );
}

function MusicSeparation({ orderCount, token, setOrderCount, onNavigateBack }) {
    const [cards, setCards] = useState([]);
    const [url, setUrl] = useState('');

    // Function to initiate song conversion
    const handleSearch = async () => {
        if (url.trim() === '') return;
        if (orderCount === 10) {
            alert("최대 요청 횟수를 넘겼습니다");
            setUrl('');
            return;
        }
        setOrderCount(orderCount + 1);
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/GCP/publish?youtubeURL=${encodeURIComponent(url)}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': '*/*',
                },
            });

            if (!response.ok) throw new Error('Failed to initiate song conversion');

            const data = await response.json();
            const newCard = {
                thumbnailURL: data.thumbnailURL,
            };
            setCards((prevCards) => [newCard, ...prevCards]);
        } catch (error) {
            console.error('Error initiating song conversion:', error);
        }
        setUrl('');
    };

    // Function to fetch the list of songs being processed
    const fetchProcessingSongs = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/GCP/DemucsSong/myOrderList`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': '*/*',
                },
            });

            if (!response.ok) throw new Error('Failed to fetch processing songs');

            const data = await response.json();
            const processedSongs = data.map(song => ({
                thumbnailURL: song.thumbnailURL,
                demucsCompleted: song.demucsCompleted,
            }));
            setCards(processedSongs);
        } catch (error) {
            console.error('Error fetching processing songs:', error);
        }
    };

    // Initial fetch and set up interval for periodic fetching
    useEffect(() => {
        fetchProcessingSongs(); // Initial fetch
        const intervalId = setInterval(fetchProcessingSongs, 120000); // Fetch every 2 minutes

        return () => clearInterval(intervalId); // Cleanup on component unmount
    }, [token]);

    return (
        <div className={styles['card-list-container']}>
            <div className={styles["url-input-section"]}>
                <input
                    type="text"
                    placeholder="변환할 음악의 유튜브 URL을 입력하세요"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className={styles['url-input']}
                />
                <span className={`${styles['tooltip-icon']}`}>
                    ?
                    <span className={`${styles['tooltip-text']}`}>
                        AI 퀴즈 노래 변환은 하루에 10곡으로 제한되며,<br />
                        변환을 시작하면 되돌릴 수 없습니다.
                    </span>
                </span>
                <button onClick={handleSearch} className={styles['url-input-button']}>변환</button>
            </div>
            <div className={styles['card-grid']}>
                {cards.map((card, index) => (
                    <div
                        className={styles['card']}
                        key={index}
                        style={{
                            backgroundImage: `url(${card.thumbnailURL})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundColor: 'gray',
                        }}
                    >
                        {!card.demucsCompleted && (
                            <div className={styles['overlay']}>
                                <span className={styles['overlay-text']}>변환 중</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <span className={`${styles['navigation-icon']} ${styles['left']}`} onClick={onNavigateBack}>
                ←
            </span>
        </div>
    );
}

export default QuizCreateListAi;
