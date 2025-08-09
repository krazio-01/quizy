import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StatsBar from '@/components/UI/StatsBar/StatsBar';
import MotionDiv from '@/components/Animated/MotionDiv';
import RotatingCircle from '@/components/UI/RotatingCircles/RotatingCircles';
import './home.scss';

const Cards = ({ title, description }: { title: string; description: string }) => (
    <div className="card">
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

const feature = [
    {
        title: 'Develop Computational Thinking',
        description:
            'We want to help you develop critical skills such as problem-solving, pattern thinking, logic, and algorithms. These skills help solve problems with real-world thinking.',
    },
    {
        title: 'Promote Collaboration',
        description:
            'Collaboration is the key to success in the 21st century. Through team activities, kids learn how to think with others, share ideas, and learn together.',
    },
    {
        title: 'Inspire Creativity',
        description:
            "Unleash your child's creative and innovative solutions to fascinating challenges in ways that spill into all aspects of life!",
    },
];

const AboutIeCard = [
    {
        title: "About Educational Initiatives",
        description: "Founded in 2001, Ei is a global leader in education innovation, operating across 12 countries. We specialize in research, adaptive learning, diagnostics, and systemic reform impacting over 15 million students and 10,000 schools. Recognized by WISE, UNESCO, Harvard, and The World Bank, our award-winning solutions have improved learning outcomes worldwide.",
    },
    {
        title: "Vision",
        description: "Creating a world where every child learns with true understanding. At Ei, we believe education should go beyond rote learning. Our mission is to help children everywhere build deep, lasting understanding through innovative assessments, personalized learning, and research-driven solutions empowering them to think, reason, and thrive.",
    },
    {
        title: "Our Mission",
        description: "Founded in 2001, Educational Initiatives (Ei) is a pioneering PedTech company combining advanced pedagogy with technology to help students learn with understanding. With over 20 years of experience and deep student-data insights, we address learning gaps and drive meaningful change in teaching and learning.",
    },
];

const HomePage = () => {
    return (
        <main className="home">
            <section className="hero">
                <RotatingCircle
                    size={250}
                    centerDotSize={30}
                    orbitDotSize={25}
                    orbitRadius={15}
                    orbitDuration={3}
                    position={{ top: '-10%', left: '-5%' }}
                />
                <RotatingCircle
                    size={250}
                    centerDotSize={30}
                    orbitDotSize={25}
                    orbitRadius={15}
                    orbitDuration={3}
                    position={{ top: '20%', right: '-8%' }}
                />

                <div className="hero-content">
                    <h1>
                        Compete Globally
                        <br />
                        Think Logically.
                    </h1>
                    <MotionDiv initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}>
                        <p>
                            Join the League of Logic by Ei ASSET - a global challenge igniting logic, curiosity, and
                            critical thinking!
                        </p>
                    </MotionDiv>
                    <MotionDiv initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }}>
                        <Link href="/register" className="cta-btn">
                            Register
                        </Link>
                    </MotionDiv>

                    <div className="stats-container">
                        <StatsBar statsArray={stats} gap="clamp(2rem, 5vw, 4.5rem)" />
                    </div>
                </div>
            </section>

            <section className="potential">
                <div className="potential-wrapper">
                    <Image width={250} height={200} src="/images/home/section.jpg" alt="Child doing math" />
                    <div className="text">
                        <h2>Unlock Your Child&apos;s True Potential</h2>
                        <p>
                            Don&apos;t miss this exceptional opportunity to see your child shine as a future logic
                            master! Harness their today for the League of Logic competition, an international platform
                            by Ei ASSET CT that fosters intellectual growth, sharpens logical reasoning, and builds
                            confidence through friendly global competition. Beyond the thrill of solving challenges,
                            your child will join a vibrant community of young thinkers, experience the joy of learning,
                            and unlock exciting rewards along the way. Give them the chance to grow, compete, and
                            thrive—register now and let their logical journey begin!
                        </p>
                    </div>
                </div>
            </section>

            <section className="features">
                <h3>What we&apos;re here for</h3>
                <p>To spark curiosity, build logic, and empower young minds to thrive.</p>
                <div className="feature-grid">
                    {feature.map((item, index) => (
                        <MotionDiv
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.27 }}
                        >
                            <Cards title={item.title} description={item.description} />
                        </MotionDiv>
                    ))}
                </div>
            </section>

            <section className="practice-cta">
                <p>Try our practice test for free!</p>
                <Link href="/register" className="cta-btn">Play Now !</Link>
            </section>

            <section className="invitation">
                <h3>You&apos;re Invited to Compete!</h3>
                <p>
                    We&apos;ve designed the competition with age-appropriate challenges that grow with your child&apos;s
                    skills. Each level builds critical thinking, logical reasoning, and problem-solving abilities in a
                    fun, engaging way.
                </p>
                <MotionDiv
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <div className="grade-cards">
                        <div className="grade-card">
                            <h4>Grades 3 &amp; 4</h4>
                            <p>
                                Jump into fun, game-like challenges that spark logical thinking and playful
                                problem-solving.
                            </p>
                        </div>
                        <div className="grade-card">
                            <h4>Grades 5 &amp; 6</h4>
                            <p>
                                Tackle more in-depth challenges that require sharp logic, critical thinking, and
                                creativity.
                            </p>
                        </div>
                        <div className="grade-card">
                            <h4>Grades 7 &amp; 8</h4>
                            <p>
                                Explore open-ended, complex tasks that strengthen logical fluency and advanced
                                problem-solving.
                            </p>
                        </div>
                        <div className="grade-card">
                            <h4>Grades 9 &amp; 10</h4>
                            <p>
                                Take on multidisciplinary challenges designed to elevate analytical thinking and foster
                                innovation.
                            </p>
                        </div>
                    </div>
                </MotionDiv>
            </section>

            <section className="register">
                <h3>How to register?</h3>
                <div className="video-placeholder">
                    <div className="video-box"></div>
                </div>
            </section>

            <section className="about-ie">
                <h3>About Ei</h3>
                <div className="about-ie-wrapper">
                    {AboutIeCard.map((item, index) => (
                        <MotionDiv
                            key={item.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.2 }}
                            transition={{ delay: index * 0.2 }}
                        >
                            <Cards title={item.title} description={item.description} />
                        </MotionDiv>
                    ))}
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
