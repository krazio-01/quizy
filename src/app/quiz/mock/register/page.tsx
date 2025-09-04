'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// import StatsBar from '@/components/UI/StatsBar/StatsBar';
import useAppStore from '@/store/store';
import './registerQuiz.scss';

const QuizRegister = () => {
    // const [selectedGrade, setGrade] = useState<string>('Grade 5-6');
    const [form, setForm] = useState({ name: '', email: '' });

    const { setSelectedGrade } = useAppStore();

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setSelectedGrade('Grade 5-6');
        router.push('/quiz/mock/rules');
    }

    return (
        <div className="practice-quiz-container">
            <div>
                <div className='hero-content-wrapper'>
                    <video autoPlay muted loop playsInline className="quizRegister-video">
                        <source src="/videos/quizbanner1.mp4" type="video/mp4" />
                    </video>

                    <div>
                        <h1>Practice Quiz</h1>
                        <p className="subtitle">Ready to test your skills?</p>
                        <p className="label">Select Your Grade</p>
                    </div>
                </div>

                <div className="grade-selector-container">
                    {/* <StatsBar
                        statsArray={grades}
                        selectedValue={selectedGrade}
                        onSelect={setGrade}
                        gap="clamp(0.5rem, 3vw, 3rem)"
                        cardWidth="100px"
                    /> */}
                </div>

                <form onSubmit={handleSubmit} className="quiz-form">
                    <p className="form-caption">
                        Let&apos;s get started! Just tell us your name and email so we can tailor the experience for you.
                    </p>

                    <div className="form-group">
                        <label htmlFor="name">Name*</label>
                        <input
                            id="name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email*</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <button type="submit" className="start-btn">
                        Start Quiz
                    </button>
                </form>
            </div>
        </div>
    );
};

export default QuizRegister;
