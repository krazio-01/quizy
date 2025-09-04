'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import useAppStore from '@/store/store';
import { gradeWiseQuestions } from './mockData';
import './mock.scss';

const Quiz = () => {
    const { selectedGrade, setScoreString } = useAppStore();
    const router = useRouter();

    useEffect(() => {
        const grade = sessionStorage.getItem('selectedGrade');
        if (!grade?.trim()) {
            router.replace('/');
            return;
        }
        
        return () => {
            sessionStorage.removeItem('selectedGrade');
        }
    }, [selectedGrade, router]);

    const gradeKey = selectedGrade.replace('Grade ', '').trim();
    const gradeData = gradeWiseQuestions.find((g) => g.grade === gradeKey);
    const totalQuestions = gradeData?.questions.length || 0;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [answerStatuses, setAnswerStatuses] = useState<(null | 'correct' | 'incorrect')[]>(
        Array(totalQuestions).fill(null)
    );

    if (!selectedGrade?.trim()) return <div className="returning-state" />;

    const currentQuestion = gradeData?.questions[currentIndex];
    const isCorrectAnswer = selectedOption === currentQuestion?.correctAnswerIndex;

    const resetState = () => {
        setSelectedOption(null);
        setIsAnswered(false);
    };

    const goToQuestion = (index: number) => {
        setCurrentIndex(index);
        resetState();
    };

    const getVisiblePages = () => {
        const visiblePages = 5;
        const start = Math.max(0, Math.min(currentIndex - Math.floor(visiblePages / 2), totalQuestions - visiblePages));
        return Array.from({ length: Math.min(visiblePages, totalQuestions) }, (_, i) => start + i);
    };

    const handleOptionClick = (index: number) => {
        if (!isAnswered) setSelectedOption(index);
    };

    const handleCheck = () => {
        if (selectedOption === null) {
            toast.error('Please select an option before checking.');
            return;
        }
        setIsAnswered(true);
        setAnswerStatuses((prev) => {
            const updated = [...prev];
            updated[currentIndex] = isCorrectAnswer ? 'correct' : 'incorrect';
            return updated;
        });
    };

    const renderFeedback = () => (
        <div className={`feedback ${isCorrectAnswer ? 'correct-feedback' : 'incorrect-feedback'}`}>
            <div className="icon-placeholder">
                <img
                    src={isCorrectAnswer ? '/videos/quiz2.gif' : '/videos/quiz3.gif'}
                    alt={isCorrectAnswer ? 'Correct Answer' : 'Wrong Answer'}
                />
            </div>
            <div className="feedback-text">
                {isCorrectAnswer ? (
                    <>
                        <p>That&apos;s right! You nailed it!</p>
                        <p>{currentQuestion?.explanation}</p>
                    </>
                ) : (
                    <>
                        <p>Oops! That&apos;s not quite right, give it another shot!</p>
                        <p>{currentQuestion?.explanation}</p>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <div className="quiz-container">
            <h1>Practice Quiz</h1>
            <h3>{selectedGrade}</h3>

            <div className="question-text">{currentQuestion?.questionText}</div>

            <div className="options">
                {currentQuestion?.options.map((option, index) => {
                    let className = 'option';
                    if (!isAnswered && selectedOption === index) className += ' selected';

                    if (isAnswered) {
                        if (isCorrectAnswer && index === currentQuestion.correctAnswerIndex) className += ' correct';
                        else if (index === selectedOption && !isCorrectAnswer) className += ' incorrect';
                    }

                    return (
                        <button
                            key={index}
                            className={className}
                            onClick={() => handleOptionClick(index)}
                            disabled={isAnswered}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>

            {!isAnswered && (
                <button className="check-button" onClick={handleCheck}>
                    Check
                </button>
            )}

            {isAnswered && !isCorrectAnswer && (
                <button className="retry-button" onClick={resetState}>
                    Retry
                </button>
            )}

            {isAnswered && renderFeedback()}

            <div className="pagination">
                <button disabled={currentIndex === 0} onClick={() => goToQuestion(currentIndex - 1)}>
                    Previous
                </button>

                {getVisiblePages().map((index) => {
                    let statusClass = '';
                    if (index === currentIndex) statusClass = 'current';
                    else if (answerStatuses[index] === 'correct') statusClass = 'answered-correct';
                    else if (answerStatuses[index] === 'incorrect') statusClass = 'answered-incorrect';

                    return (
                        <button key={index} className={`page-dot ${statusClass}`} onClick={() => goToQuestion(index)}>
                            {index + 1}
                        </button>
                    );
                })}

                <button
                    onClick={() => {
                        if (currentIndex === totalQuestions - 1) {
                            const correctCount = answerStatuses.filter((s) => s === 'correct').length;
                            const score = `${correctCount}/${totalQuestions}`;
                            setScoreString(score);

                            toast.success(`Quiz Completed! Your score: ${score}`);
                            router.push('/quiz/mock/complete');
                        } else {
                            goToQuestion(currentIndex + 1);
                        }
                    }}
                >
                    {currentIndex === totalQuestions - 1 ? 'Done' : 'Next'}
                </button>
            </div>
        </div>
    );
};

export default Quiz;
