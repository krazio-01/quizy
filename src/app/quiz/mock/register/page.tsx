'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import StatsBar from '@/components/UI/StatsBar/StatsBar';
import { toast } from 'sonner';
import axios from '@/utils/axios';
import useAppStore from '@/store/store';
import { useSession } from 'next-auth/react';
import './registerQuiz.scss';

const grades = [
    { value: 'Grade 3-4', label: '' },
    { value: 'Grade 5-6', label: '' },
    { value: 'Grade 7-8', label: '' },
    { value: 'Grade 9-10', label: '' },
];

const Page = () => {
    const [selectedGrade, setGrade] = useState<string>('Grade 5-6');
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const { setSelectedGrade, setIsRegisteredUser } = useAppStore();
    const router = useRouter();
    const { data: session } = useSession();

    const handleSubmit = async () => {
        setLoading(true);
        const payload = {
            name: session?.user?.name || name.trim(),
            email: session?.user?.email || email.trim().toLowerCase(),
            grade: selectedGrade,
        };

        try {
            const { data } = await axios.post('/api/quiz/mockTest', payload);
            setSelectedGrade(selectedGrade);
            setIsRegisteredUser(data?.isExistingUser);
            router.push('/quiz/mock/rules');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Something went wrong';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="practice-quiz-container">
            <div>
                <div className="hero-content-wrapper">
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
                    <StatsBar
                        statsArray={grades}
                        selectedValue={selectedGrade}
                        onSelect={setGrade}
                        gap="clamp(0.5rem, 3vw, 3rem)"
                        cardWidth="100px"
                    />
                </div>

                <div className="quiz-form">
                    <p className="form-caption">
                        Let&apos;s get started! Just tell us your name and email so we can tailor the experience for you.
                    </p>

                    <div className="form-group">
                        <label htmlFor="name">Name*</label>
                        <input
                            id="name"
                            name="name"
                            value={session?.user?.name || name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            required
                            disabled={!!session?.user}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email*</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={session?.user?.email || email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            required
                            disabled={!!session?.user}
                        />
                    </div>

                    <button onClick={handleSubmit} className="start-btn" disabled={loading}>
                        {loading ? 'Starting...' : 'Start Quiz'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Page;
