'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAppStore from '@/store/store';
import './mockSuccess.scss';
import RewardsSection from '@/components/layout/rewards/RewardsSection';

const Page = () => {
    const { scoreString } = useAppStore();
    const router = useRouter();

    useEffect(() => {
        if (scoreString === '0/0') {
            router.push('/quiz/mock/register');
        }
    }, [scoreString, router]);

    if (!scoreString || scoreString === '0/0') return <div className='no-score' />

    return (
        <div className="mock-success-container">
            <div className="score-status">
                <video autoPlay muted loop playsInline className="score-video">
                    <source src="/videos/resultBanner.mp4" type="video/mp4" />
                </video>

                <div className='banner-content'>
                    <p>Your Score: <strong>{scoreString}</strong></p>
                    <h1>That was just the warm-up!</h1>
                    <p className="sub-text">
                        Ready to see where you truly stand in the League of Logic?
                    </p>

                    <Link href="/register">Register</Link>
                </div>
            </div>

            <div className='rewards-setion-score-page'>
                <RewardsSection title='Rewards' />
            </div>
        </div>
    );
};

export default Page;
