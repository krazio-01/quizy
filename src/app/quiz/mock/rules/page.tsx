'use client';
import { useEffect } from 'react';
import useAppStore from '@/store/store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import './rules.scss';

const Page = () => {
    const { selectedGrade } = useAppStore();

    const router = useRouter();

    useEffect(() => {
        if (!selectedGrade?.trim()) {
            router.replace('/');
            return;
        }

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [selectedGrade]);

    if (!selectedGrade?.trim()) return <div className="returning-state" />;

    return (
        <div className="quiz-instructions-container">
            <div className="quiz-card">
                <h2>Before You Start the Quiz</h2>
                <div className="spacer">
                    <p className="no-spacing">
                        Take your time to carefully read and understand each question. This is a practice quiz, so
                        there&apos;s no time limit—focus on solving the problems logically and accurately.
                    </p>

                    <span>How It Works:</span>
                </div>
                <ul>
                    <li>Select your answer by clicking one of the options.</li>
                    <li>Click the &apos;Check&apos; button to see if you&apos;re correct.</li>
                    <li>After checking your answer, you&apos;ll get instant feedback:</li>
                </ul>

                <p>
                    You can move between questions using the Previous and Next buttons, or click the page numbers below
                    to jump to any question directly.
                </p>

                <p>
                    Use each attempt as a learning opportunity. Good luck, and enjoy sharpening your logical thinking!
                </p>

                <div className="answer-gifs">
                    <div className="gif-item">
                        <p>Correct Answer</p>
                        <img src="/videos/quiz2.gif" alt="Correct Answer" />
                    </div>
                    <div className="gif-item">
                        <p>Wrong Answer</p>
                        <img src="/videos/quiz3.gif" alt="Wrong Answer" />
                    </div>
                </div>

                <Link
                    className="start-btn"
                    href="/quiz/mock"
                    onClick={() => toast.success("Best of Luck!")}
                >
                    Start Quiz
                </Link>
            </div>
        </div>
    );
};

export default Page;
