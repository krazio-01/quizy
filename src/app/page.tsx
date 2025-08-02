'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StatsBar from '@/components/UI/StatsBar/StatsBar';
import './home.scss';

const FeatureCard = ({ title, description }: { title: string; description: string }) => (
    <div className="feature-card">
        <h4>{title}</h4>
        <p>{description}</p>
    </div>
);

const stats = [
    { label: 'Active Students', value: '50K+' },
    { label: 'Countries', value: '120+' },
    { label: 'Challenges Solved', value: '1M+' },
    { label: 'Prize Pool', value: '$100K' },
];

const HomePage = () => {
    return (
        <main className="home">
            <section className="hero">
                <div className="hero-content">
                    <h1>
                        Compete Globally
                        <br />
                        Think Logically.
                    </h1>
                    <p>
                        Join the League of Logic by Ei ASSET - a global challenge igniting logic, curiosity, and
                        critical thinking!
                    </p>
                    <Link href="/register" className="cta-btn">Register</Link>

                    <div className="stats-container">
                        <StatsBar statsArray={stats} gap='clamp(2rem, 5vw, 4.5rem)' />
                    </div>
                </div>
            </section>

            <section className="potential">
                <div className="potential-wrapper">
                    <Image width={250} height={200} src="/images/home/section.jpg" alt="Child doing math" />
                    <div className="text">
                        <h2>Unlock Your Child&apos;s True Potential</h2>
                        <p>
                            Don&apos;t miss this exceptional opportunity to see your child shine as a future logic master!
                            Harness their today for the League of Logic competition, an international platform by Ei
                            ASSET CT that fosters intellectual growth, sharpens logical reasoning, and builds confidence
                            through friendly global competition. Beyond the thrill of solving challenges, your child
                            will join a vibrant community of young thinkers, experience the joy of learning, and unlock
                            exciting rewards along the way. Give them the chance to grow, compete, and thrive—register
                            now and let their logical journey begin!
                        </p>
                    </div>
                </div>
            </section>

            <section className="features">
                <h3>What we&apos;re here for</h3>
                <p>To spark curiosity, build logic, and empower young minds to thrive.</p>
                <div className="feature-grid">
                    <FeatureCard
                        title="Develop Computational Thinking"
                        description="We want to help you develop critical skills such as problem-solving, pattern thinking, logic, and algorithms. These skills help solve problems with real-world thinking."
                    />
                    <FeatureCard
                        title="Promote Collaboration"
                        description="Collaboration is the key to success in the 21st century. Through team activities, kids learn how to think with others, share ideas, and learn together."
                    />
                    <FeatureCard
                        title="Inspire Creativity"
                        description="Unleash your child&apos;s creative and innovative solutions to fascinating challenges in ways that spill into all aspects of life!"
                    />
                </div>
            </section>

            <section className="practice-cta">
                <p>Try our practice test for free!</p>
                <button className="cta-btn">Play Now !</button>
            </section>

            <section className="invitation">
                <h3>You&apos;re Invited to Compete!</h3>
                <p>
                    We&apos;ve designed the competition with age-appropriate challenges that grow with your child&apos;s skills. Each level builds
                    critical thinking, logical reasoning, and problem-solving abilities in a fun, engaging way.
                </p>
                <div className="grade-cards">
                    <div className="grade-card">
                        <h4>Grades 3 &amp; 4</h4>
                        <p>Jump into fun, game-like challenges that spark logical thinking and playful problem-solving.</p>
                    </div>
                    <div className="grade-card">
                        <h4>Grades 5 &amp; 6</h4>
                        <p>Tackle more in-depth challenges that require sharp logic, critical thinking, and creativity.</p>
                    </div>
                    <div className="grade-card">
                        <h4>Grades 7 &amp; 8</h4>
                        <p>Explore open-ended, complex tasks that strengthen logical fluency and advanced problem-solving.</p>
                    </div>
                    <div className="grade-card">
                        <h4>Grades 9 &amp; 10</h4>
                        <p>Take on multidisciplinary challenges designed to elevate analytical thinking and foster innovation.</p>
                    </div>
                </div>
            </section>

            <section className="register">
                <h3>How to register?</h3>
                <div className="video-placeholder">
                    <div className="video-box"></div>
                </div>
            </section>

            <section className="acknowledgement">
                <h3>Our programs are reviewed / acknowledged by</h3>
                <div className="sponsors">
                    <Image width={500} height={100} src="/images/home/sponsor.png" alt="Logo 1" />
                </div>
            </section>
        </main>
    );
};

export default HomePage;
