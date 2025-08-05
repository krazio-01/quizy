'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import StatsBar from '@/components/UI/StatsBar/StatsBar';
import { toast } from 'sonner';
import axios from 'axios';
import useAppStore from '@/store/store';
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

    const { setSelectedGrade } = useAppStore();

    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        const payload = {
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            grade: selectedGrade,
        };

        try {
            const { data } = await axios.post('/api/quiz/mockTest', payload);
            setSelectedGrade(selectedGrade)
            toast.success(data.message || 'Quiz started successfully');
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
                <h1>Practice Quiz</h1>
                <p className="subtitle">Ready to test your skills?</p>
                <p className="label">Select Your Grade</p>

                <div className="grade-selector-container">
                    <StatsBar
                        statsArray={grades}
                        selectedValue={selectedGrade}
                        onSelect={setGrade}
                        gap="clamp(1rem, 3vw, 3rem)"
                        cardWidth="85px"
                    />
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
                            placeholder="Dave North"
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
                            placeholder="User@email.com"
                            required
                        />
                    </div>

                    <button type="submit" className="start-btn" disabled={loading} onClick={handleSubmit}>
                        {loading ? 'Starting...' : 'Start Quiz'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Page;
