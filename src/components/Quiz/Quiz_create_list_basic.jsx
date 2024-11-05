import React, { startTransition, useState, useEffect } from 'react';
import './CSS/Quiz_create_list_basic.css';
import editButton from '../../img/edit_button.svg';
import deleteButton from '../../img/delete_button.svg';
import QuizCreateDetail from './Quiz_create_detail';

const QuizCreateList = ({ quizId, hintSetting, token }) => {
    const [url, setUrl] = useState('');
    const [cards, setCards] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);


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

    useEffect(() => {
        console.log(quizId);
        if (quizId !== -1) {
            fetch(`http://localhost:8080/song/youtube/songList?quizId=${quizId}`, {
                method: 'GET',
                headers: {
                    'Accept': '*/*',
                    'Authorization': `Bearer ${token}`,
                },
            })
                .then(async (response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(async (data) => {
                    const formattedCards = await Promise.all(data.map(async (item) => {
                        const maxTimeInSeconds = convertToSeconds(item.songTime);

                        // Fetch answers
                        const answers = await fetchGetApi(`http://localhost:8080/song/youtube/${data.quizSongRelationID}/answers`, token);
                        // Fetch hints
                        const hints = await fetchGetApi(`http://localhost:8080/song/youtube/${item.quizSongRelationID}/hint`, token);

                        return {
                            url: item.playURL,
                            answers: answers, // 할당된 answers
                            hints: hints.map(hint => ({
                                hintId: hint.hintId,
                                hintTime: convertToSeconds(hint.hintTime),
                                hintType: hint.hintType,
                                hintText: hint.hintText
                            })), // 할당된 hints
                            startTime: 0,
                            quizRelationId: item.quizSongRelationID,
                            quizUrl: item.playURL,
                            quizThumbnail: item.thumbnailURL,
                            maxTime: maxTimeInSeconds,
                        };
                    }));
                    setCards(formattedCards);
                })
                .catch((error) => {
                    console.error('Error fetching song list:', error);
                });
        }
    }, [quizId, token]);

    const convertToSeconds = (timeString) => {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        console.log(hours, minutes, seconds);
        return (hours * 3600) + (minutes * 60) + seconds;
    };

    const handleAddCard = async () => {
        if (url.trim() === '') return;
    
        try {
            const response = await fetch('http://localhost:8080/song/youtube', {
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
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            const maxTimeInSeconds = convertToSeconds(data.songTime);
            // Fetch answers
            const answers = await fetchGetApi(`http://localhost:8080/song/youtube/${data.quizSongRelationID}/answers`, token);
            const newCard = {
                url: data.playURL,
                answers: answers, // 할당된 answers
                hints: [],
                startTime: 0,
                quizRelationId: data.quizSongRelationID,
                quizUrl: data.playURL,
                quizThumbnail: data.thumbnailURL,
                maxTime: maxTimeInSeconds,
            };
    
            setCards((prevCards) => [...prevCards, newCard]);
            setUrl('');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeleteCard = (index) => {
        fetch(`http://localhost:8080/song/youtube/${cards[index].quizRelationId}/delSong`, {
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


    const modalHandlers = { setIsModalOpen, setSelectedCardIndex, handleUpdateAnswers, handleUpdateHints, handleUpdateStartTime };
    return (
        <>
            <div className={`card-list-container ${isModalOpen ? 'blur' : ''}`}>
                <div className="url-input-section">
                    <input
                        type="text"
                        placeholder="URL을 입력하세요"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className='url-input'
                    />
                    <button onClick={handleAddCard} className='url-input-button'>추가</button>
                </div>
                <div className="card-grid">
                    {cards.map((card, index) => (
                        <div className="card"
                            key={index}
                            style={{
                                backgroundImage: `url(${card.quizThumbnail})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundColor: 'gray',
                            }}
                        >
                            <div className="card-content">
                                <div className="card-icons">
                                    <button className="card-edit-btn" onClick={() => openModal(index)}>
                                        <img src={editButton} alt="Edit" className='card-icon-img' />
                                    </button>
                                    <button
                                        className="card-delete-btn"
                                        onClick={() => handleDeleteCard(index)}
                                    >
                                        <img src={deleteButton} alt="Delete" className='card-icon-img' />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {isModalOpen && (
                <QuizCreateDetail
                    info={{
                        card: cards[selectedCardIndex],
                        hintSetting: hintSetting,
                        token: token,
                    }}
                    handlers={modalHandlers}
                />
            )}
        </>
    );
};

export default QuizCreateList;
