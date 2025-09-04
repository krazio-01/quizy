'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAppStore from '@/store/store';
import RewardsSection from '@/components/layout/rewards/RewardsSection';
import './mockSuccess.scss';

const Page = () => {
    const { scoreString, isRegisteredUser } = useAppStore();
    const [score, setScore] = useState('0/0');
    const router = useRouter();

    useEffect(() => {
        const quizScore = sessionStorage.getItem('quizScore');
        if (!quizScore?.trim()) {
            router.push('/quiz/mock/register');
        }
        setScore(quizScore || '0/0');
        sessionStorage.removeItem('selectedGrade');
    }, [scoreString, router]);

    if (!score || score === '0/0') return <div className='no-score' />

    return (
        <div className="mock-success-container">
            <div className="score-status">
                <video autoPlay muted loop playsInline className="score-video">
                    <source src="/videos/resultBanner.mp4" type="video/mp4" />
                </video>

                <div className='banner-content'>
                    <p>Your Score: <strong>{score}</strong></p>
                    <h1>That was just the warm-up!</h1>
                    <p className="sub-text">
                        Ready to see where you truly stand in the League of Logic?
                    </p>

                    {!isRegisteredUser && <Link href="/register">Register</Link>}
                </div>
            </div>

            <div className='rewards-setion-score-page'>
                <RewardsSection title='Rewards' />
            </div>
        </div>
    );
};

export default Page;
