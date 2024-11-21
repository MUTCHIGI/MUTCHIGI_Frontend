import React, { startTransition, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './CSS/Quiz_create_list_basic.module.css';
import editButton from '../../img/edit_button.svg';
import deleteButton from '../../img/delete_button.svg';
import QuizCreateDetail from './Quiz_create_detail';
import spinner from '../../img/loading.svg'

const QuizList = ({ info, handlers }) => {
    const { isModalOpen, url, cards } = info;
    const { setUrl, handleAddCard, openModal, handleDeleteCard } = handlers;

    return (
        <>
            <div className={`${styles["card-list-container"]} ${isModalOpen ? styles["blur"] : ''}`}>
                <div className={styles["url-input-section"]}>
                    <input
                        type="text"
                        placeholder="URL을 입력하세요"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className={styles["url-input"]}
                    />
                    <button onClick={handleAddCard} className={styles["url-input-button"]}>추가</button>
                </div>
                <div className={styles["card-grid"]}>
                    {cards.map((card, index) => (
                        <div className={styles["card"]}
                            key={index}
                            style={{
                                backgroundImage: `url(${card.quizThumbnail})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundColor: 'gray',
                            }}
                        >
                            <div className={styles["card-content"]}>
                                <div className={styles["card-icons"]}>
                                    <button className={styles["card-edit-btn"]} onClick={() => openModal(index)}>
                                        <img src={editButton} alt="Edit" className={styles["card-icon-img"]} />
                                    </button>
                                    <button
                                        className={styles["card-delete-btn"]}
                                        onClick={() => handleDeleteCard(index)}
                                    >
                                        <img src={deleteButton} alt="Delete" className={styles["card-icon-img"]} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

const QuizCreateList = ({ quizId, token }) => {
    const [url, setUrl] = useState('');
    const [cards, setCards] = useState([]);
    const [hintSetting, setHintSetting] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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

    const convertToSeconds = (timeString) => {
        if (timeString === null)
        {
            return -1;
        }
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        console.log(hours, minutes, seconds);
        return (hours * 3600) + (minutes * 60) + seconds;
    };

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
                
                setHintSetting(formattedHintSetting);
                
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
                        let answers;
                        try {
                            answers = await fetchGetApi(`${import.meta.env.VITE_SERVER_IP}/song/youtube/${item.quizSongRelationID}/answers`, token);
                        }
                        catch {
                            answers = [];
                        }
                        // Fetch hints
                        const hints = await fetchGetApi(`${import.meta.env.VITE_SERVER_IP}/song/youtube/${item.quizSongRelationID}/hint`, token);
                        // fetch startTime
                        let startTime;
                        try{
                            startTime = await fetchGetApi(`${import.meta.env.VITE_SERVER_IP}/song/youtube/${item.quizSongRelationID}/startTime`, token);
                        }
                        catch {
                            startTime = null;
                        }
                        console.log(hints);
                        return {
                            url: item.playURL,
                            answers: answers,
                            hints: hints.map(hint => ({
                                hintId: hint.hintId,
                                hintTime: convertToSeconds(hint.hintTime),
                                hintType: hint.hintType,
                                hintText: hint.hintText
                            })),
                            startTime: convertToSeconds(startTime),
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
        setIsLoading(false);
    }, [quizId, token]);


    const handleAddCard = async () => {
        if (url.trim() === '') return;

        try {
            const response = await fetch(`${import.meta.env.VITE_SERVER_IP}/song/youtube`, {
                method: 'POST',
                headers: {
                    'Accept': '*/*',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // token을 props나 상태로 전달받아 사용
                },
                body: JSON.stringify({
                    youtubeURL: url,
                    quizId: quizId,
                }),
            });

            if (!response.ok) {
                alert("이미 추가된 곡입니다.")
                setUrl('');
            }

            const data = await response.json();
            const maxTimeInSeconds = convertToSeconds(data.songTime);
            // Fetch answers
            try {
                const answers = await fetchGetApi(`${import.meta.env.VITE_SERVER_IP}/song/youtube/${data.quizSongRelationID}/answers`, token);
                const newCard = {
                    url: data.playURL,
                    answers: answers, // 할당된 answers
                    hints: [],
                    startTime: -1,
                    quizRelationId: data.quizSongRelationID,
                    quizUrl: data.playURL,
                    quizThumbnail: data.thumbnailURL,
                    maxTime: maxTimeInSeconds,
                };
                setCards((prevCards) => [...prevCards, newCard]);
            }
            catch (error) {
                const newCard = {
                    url: data.playURL,
                    answers: [], // 할당된 answers
                    hints: [],
                    startTime: -1,
                    quizRelationId: data.quizSongRelationID,
                    quizUrl: data.playURL,
                    quizThumbnail: data.thumbnailURL,
                    maxTime: maxTimeInSeconds,
                };
                setCards((prevCards) => [...prevCards, newCard]);
            }
            setUrl('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteCard = (index) => {
        fetch(`${import.meta.env.VITE_SERVER_IP}/song/youtube/${cards[index].quizRelationId}/delSong`, {
            method: 'DELETE',
            headers: {
                'Accept': '*/*',
                'Authorization': `Bearer ${token}`, // token을 props나 상태로 전달받아 사용
            },
            body: JSON.stringify({
                youtubeURL: url,
                quizId: quizId,
            }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                setCards(cards.filter((_, i) => i !== index));
                return response.status !== 200 ? response.json() : null;
            })
            .then((data) => {
                if (data) {
                    console.log("Success:", data);
                }
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

    let navigate = useNavigate();

    const nextStep = async () => {
        const hasInvalidHints = cards.some((card) => {
            return (
                card.hints.length < hintSetting.length || // Not enough hints
                card.hints.some((hint) => !hint || hint.hintText.trim() === '') // Check null or empty hint
            );
        });
    
        if (hasInvalidHints) {
            alert("힌트를 설정하지 않은 항목이 있습니다");
            return; // Prevent the request from being sent
        }

        const hasInvalidTime = cards.some((card) => {
            return (
                (card.startTime === -1) 
            );
        });

        if (hasInvalidTime) {
            alert("시작 시간을 설정하지 않은 항목이 있습니다");
            return; 
        }

        const hasInvalidAnswer = cards.some((card) => {
            return (
                card.answers.length < 1
            );
        });

        if (hasInvalidAnswer) {
            alert("정답을 설정하지 않은 항목이 있습니다");
            return;
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

    const modalHandlers = { setIsModalOpen, setSelectedCardIndex, handleUpdateAnswers, handleUpdateHints, handleUpdateStartTime };
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
                <>
                    <QuizList
                        info={{ isModalOpen, url, cards }}
                        handlers={{
                            setUrl: setUrl,
                            handleAddCard: handleAddCard,
                            openModal: openModal,
                            handleDeleteCard: handleDeleteCard
                        }}
                    />
                    <div className={styles["navigation-buttons"]}>
                        <button
                            type="button"
                            onClick={nextStep}
                            className={styles["nav-button"]}
                        >
                            퀴즈 생성
                        </button>
                    </div>
                    {isModalOpen && (
                        <QuizCreateDetail
                            info={{
                                card: cards[selectedCardIndex],
                                hintSetting: hintSetting,
                                token: token,
                                instrumentId : 0,
                            }}
                            handlers={modalHandlers}
                        />
                    )}
                </>
            )}
        </>
    );
};

export default QuizCreateList;
