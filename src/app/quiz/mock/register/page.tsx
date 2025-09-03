'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import StatsBar from '@/components/UI/StatsBar/StatsBar';
import { toast } from 'sonner';
import axios from '@/utils/axios';
import useAppStore from '@/store/store';
import { useSession } from 'next-auth/react';
import Form from 'next/form';
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
    const [form, setForm] = useState({ name: '', email: '' });

    const { setSelectedGrade, setIsRegisteredUser } = useAppStore();

    const router = useRouter();

    const { data: session } = useSession();

    const handleSubmit = (formData: FormData) => {
        const name = formData.get('name')?.toString().trim() || '';
        const email = formData.get('email')?.toString().trim().toLowerCase() || '';
        const grade = formData.get('grade')?.toString() || '';
        setLoading(true);

        axios.post('/api/quiz/mockTest', { name, email, grade })
            .then(({ data }) => {
                setSelectedGrade(grade);
                setIsRegisteredUser(data.isExistingUser);
                setLoading(false);
                router.push('/quiz/mock/rules');
            })
            .catch((err) => toast.error(err.response?.data?.message || 'Something went wrong'));
    };

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
                    <StatsBar
                        statsArray={grades}
                        selectedValue={selectedGrade}
                        onSelect={setGrade}
                        gap="clamp(0.5rem, 3vw, 3rem)"
                        cardWidth="100px"
                    />
                </div>

                <Form action={handleSubmit} className="quiz-form">
                    <p className="form-caption">
                        Let&apos;s get started! Just tell us your name and email so we can tailor the experience for you.
                    </p>

                    <input type="hidden" name="grade" value={selectedGrade} />

                    <div className="form-group">
                        <label htmlFor="name">Name*</label>
                        <input
                            name="name"
                            placeholder="Enter your name"
                            required
                            disabled={!!session?.user}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email*</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            required
                            disabled={!!session?.user}
                        />
                    </div>

                    <button type="submit" className="start-btn" disabled={loading}>
                        {loading ? 'Starting...' : 'Start Quiz'}
                    </button>
                </Form>
            </div>
        </div>
    );
};

export default Page;
