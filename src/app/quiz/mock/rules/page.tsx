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
    }, [selectedGrade, router]);

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

                <div className="feedback-examples">
                    <p>
                        Green means your answer is correct.
                        <span className="indicator correct"></span>
                    </p>
                    <p>
                        Red means your answer is incorrect—you can retry.
                        <span className="indicator incorrect"></span>
                    </p>
                    <p>
                        Yellow highlights your current quiz page in the navigation bar.
                        <span className="indicator current"></span>
                    </p>
                </div>

                <p>
                    You can move between questions using the Previous and Next buttons, or click the page numbers below
                    to jump to any question directly.
                </p>

                <p>
                    Use each attempt as a learning opportunity. Good luck, and enjoy sharpening your logical thinking!
                </p>

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
