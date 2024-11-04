import React, { startTransition, useState } from 'react';
import styles from './CSS/Quiz_create_list_ai.module.css';
import './CSS/Quiz_create_list_basic.css'
import editButton from '../../img/edit_button.svg';
import deleteButton from '../../img/delete_button.svg';
import QuizCreateDetail from './Quiz_create_detail';
import { FaPlus, FaEdit, FaTrash, FaArrowRight, FaArrowLeft } from 'react-icons/fa';

const QuizCreateListAi = ({ quizId, hintSetting, token }) => {
    const [cards, setCards] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCardIndex, setSelectedCardIndex] = useState(null);
    const [currentScreen, setCurrentScreen] = useState(1);
    const [selectedItems, setSelectedItems] = useState([]);

    const switchScreen = (screenNumber) => setCurrentScreen(screenNumber);

    const confirmCandidate = () => {
        setCards([...cards, ...selectedItems]);
        setSelectedItems([]);  // Clear selected items in ScreenTwo
        switchScreen(1);
    };

    const handleDeleteCard = (index) => {
        /*
            api code be here
        */
        setCards(cards.filter((_, i) => i !== index));
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
                    cards={cards}
                    isModalOpen={isModalOpen}
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
                    onNavigateBack={() => switchScreen(2)}
                    onNavigateToSeparation={() => switchScreen(4)}
                />
            )}
            {currentScreen === 4 && (
                <MusicSeparation
                    token={token}
                    quizId={quizId}
                    onNavigateBack={() => switchScreen(3)}
                />
            )}
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

function MusicList({ cards, isModalOpen, openModal, handleDeleteCard, onNavigate }) {
    return (
        <div className={`${styles['card-list-container']} ${isModalOpen ? styles['blur'] : ''}`}>
            <button className={styles['add-button']} onClick={onNavigate}>추가</button>
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
        </div>
    );
}

function SelectedCandidate({ selectedItems, setSelectedItems, onComplete, onNavigateToSearch }) {
    const handleDeleteCard = (index) => {
        setSelectedItems(selectedItems.filter((_, i) => i !== index));
    };

    return (
        <div className={styles['card-list-container']}>
            <button className={styles['complete-button']} onClick={onComplete}>선택 완료</button>
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
                        onClick={() => handleDeleteCard(index)}
                    >
                    </div>
                ))}
            </div>
            <span className={`${styles['navigation-icon']} ${styles['right']}`} onClick={onNavigateToSearch}>
                →
            </span>
        </div>
    );
}

function SearchPreProcessSong({ selectedItems, setSelectedItems, onNavigateBack, onNavigateToSeparation }) {

    const [url, setUrl] = useState('');

    const [cards, setDummyData] = useState(
        Array(8).fill().map((_, index) => ({
            url: null,
            answers: [],
            hints: [],
            startTime: 0,
            quizRelationId: null,
            quizUrl: null,
            quizThumbnail: null,
            maxTime: 120,
        }))
    );

    const handleSelectItem = (item) => {
        if (!selectedItems.includes(item)) {
            setSelectedItems([...selectedItems, item]);
        }
    };

    return (
        <div className={styles['card-list-container']}>
            <div className={styles["url-input-section"]}>
                <input
                    type="text"
                    placeholder="기존에 변환된 음악을 찾아보세요!"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className={styles['url-input']}
                />
                <button className={styles['url-input-button']}>검색</button>
            </div>
            <div className={styles['card-grid']}>
                {cards.map((card, index) => (
                    <div>
                        <div
                            className={styles['card']}
                            key={index}
                            style={{
                                backgroundImage: `url(${card.quizThumbnail})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundColor: 'gray',
                            }}
                            onClick={() => handleSelectItem(card)}
                        >
                        </div>
                        <span className={styles['card-title']}>
                            test
                        </span>
                    </div>
                ))}
            </div>
            <span className={`${styles['navigation-icon']} ${styles['left']}`} onClick={onNavigateBack}>
                ←
            </span>
            <span className={`${styles['navigation-icon']} ${styles['right']}`} onClick={onNavigateToSeparation}>
                →
            </span>
        </div>
    );
}

function MusicSeparation({ token, quizId, onNavigateBack }) {
    const [cards, setDummyData] = useState(
        Array(8).fill().map((_, index) => ({
            url: null,
            answers: [],
            hints: [],
            startTime: 0,
            quizRelationId: null,
            quizUrl: null,
            quizThumbnail: null,
            maxTime: 120,
        }))
    );

    const [url, setUrl] = useState('');

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
                    <span className={`${styles['tooltip-text']}`}>AI 퀴즈 노래 변환은 하루에 10곡으로 제한되며,<br/>
                        변환을 시작하면 되돌릴 수 없습니다.</span>
                </span>
                <button className={styles['url-input-button']}>검색</button>
            </div>
            <div className={styles['card-grid']}>
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
