'use client';
import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import useAppStore from '@/store/store';
import './mockSuccess.scss';

const Page = () => {
    const { scoreString } = useAppStore();
    const router = useRouter();

    useEffect(() => {
        if (scoreString === '0/0') {
            router.push('/quiz/register');
        }
    }, [scoreString, router]);

    if (!scoreString || scoreString === '0/0') return <div className='no-score' />

    return (
        <div className="mock-success-container">
            <div className="score-status">
                <p>Your Score: <strong>{scoreString}</strong></p>
            </div>

            <h1>That was just the warm-up!</h1>
            <p className="sub-text">
                Ready to see where you truly stand in the League of Logic?
            </p>

            <Link href="/register">Register</Link>
        </div>
    );
};

export default Page;
