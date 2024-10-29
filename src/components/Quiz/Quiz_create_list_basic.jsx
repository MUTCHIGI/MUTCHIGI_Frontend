import React, { startTransition, useState } from 'react';
import './CSS/Quiz_create_list_basic.css';
import editButton from '../../img/edit_button.svg';
import deleteButton from '../../img/delete_button.svg';
import QuizCreateDetail from './Quiz_create_detail';

const QuizCreateList = ({ quizId, hintSetting, token }) => {
    const [url, setUrl] = useState('');
    const [cards, setCards] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);


    const convertToSeconds = (timeString) => {
        const [hours, minutes, seconds] = timeString.split(':').map(Number);
        console.log(hours, minutes, seconds);
        return (hours * 3600) + (minutes * 60) + seconds;
    };

    const handleAddCard = () => {
        if (url.trim() === '') return;

        fetch('http://localhost:8080/song/youtube', {
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
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                const maxTimeInSeconds = convertToSeconds(data.songTime);
                const newCard = {
                    url: data.playURL,
                    answers: [],
                    hints: [],
                    startTime: 0,
                    quizRelationId: data.quizSongRelationID,
                    quizUrl: data.playURL,
                    quizThumbnail: data.thumbnailURL,
                    maxTime: maxTimeInSeconds,
                };
                setCards((prevCards) => [...prevCards, newCard]);
                setUrl('');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
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
