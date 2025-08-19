import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import StatsBar from '@/components/UI/StatsBar/StatsBar';
import MotionDiv from '@/components/Animated/MotionDiv';
import './home.scss';

const Cards = ({ title, description, icon }: { title: string; description: string; icon?: string }) => (
    <div className="card">
        {icon && <Image src={icon} alt="Card Icon" width={50} height={50} className="card-icon" />}
        <h4>{title}</h4>
        <p>{description}</p>
    </div>
);

const CTASection = ({ buttonText, videoSrc, link }: { buttonText: string; videoSrc: string; link: string }) => (
    <section className="practice-cta">
        <video autoPlay muted loop playsInline>
            <source src={videoSrc} type="video/mp4" />
        </video>
        <p></p>
        <Link href={link} className="cta-btn">
            {buttonText}
        </Link>
    </section>
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
        icon: '/images/home/icon1.png',
    },
    {
        title: 'Promote Collaboration',
        description:
            'Collaboration is the key to success in the 21st century. Through team activities, kids learn how to think with others, share ideas, and learn together.',
        icon: '/images/home/icon2.png',
    },
    {
        title: 'Inspire Creativity',
        description:
            "Unleash your child's creative and innovative solutions to fascinating challenges in ways that spill into all aspects of life!",
        icon: '/images/home/icon3.png',
    },
];

const AboutIeCard = [
    {
        title: 'About Educational Initiatives',
        description:
            'Founded in 2001, Ei is a global leader in education innovation, operating across 12 countries. We specialize in research, adaptive learning, diagnostics, and systemic reform impacting over 15 million students and 10,000 schools. Recognized by WISE, UNESCO, Harvard, and The World Bank, our award-winning solutions have improved learning outcomes worldwide.',
    },
    {
        title: 'Vision',
        description:
            'Creating a world where every child learns with true understanding. At Ei, we believe education should go beyond rote learning. Our mission is to help children everywhere build deep, lasting understanding through innovative assessments, personalized learning, and research-driven solutions empowering them to think, reason, and thrive.',
    },
    {
        title: 'Our Mission',
        description:
            'Founded in 2001, Educational Initiatives (Ei) is a pioneering PedTech company combining advanced pedagogy with technology to help students learn with understanding. With over 20 years of experience and deep student-data insights, we address learning gaps and drive meaningful change in teaching and learning.',
    },
];

const HomePage = () => {
    return (
        <main className="home">
            <section className="hero">
                <video autoPlay muted loop playsInline className="hero-video">
                    <source src="/videos/homepageBanner.mp4" type="video/mp4" />
                </video>

                <div className="hero-content">
                    <div>
                        <MotionDiv initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }}>
                            <p>
                                Join the League of Logic by Ei ASSET - a global challenge igniting logic, curiosity, and
                                critical thinking!
                            </p>
                        </MotionDiv>
                        <h1>
                            Compete Globally
                            <br />
                            Think Logically.
                        </h1>
                    </div>
                </div>
            </section>

            <div className="stats-container">
                <StatsBar statsArray={stats} gap="clamp(2rem, 5vw, 4.5rem)" />
            </div>

            <section className="potential">
                <div className="potential-wrapper">
                    <video autoPlay muted loop playsInline>
                        <source src="/videos/Kids.mp4" type="video/mp4" />
                    </video>
                    <div className="text">
                        <h2>Are they ready to think outside the box?</h2>
                        <p>
                            The League of Logic is a global online competition designed to promote and develop critical
                            thinking, logical reasoning, and problem-solving abilities in students from Grades 3 to 10,
                            across all curricula.
                        </p>
                        <p>
                            In today&apos;s rapidly changing world, academic success alone is not
                            enough. Children must be equipped with the ability to think independently, solve problems in
                            innovative ways, and engage with the world through logic and reflection. That&apos;s exactly
                            where the League of Logic steps in — it goes beyond conventional academic exams to focus on
                            nurturing cognitive skills that are essential for the 21st century.
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
                            <Cards title={item.title} description={item.description} icon={item.icon} />
                        </MotionDiv>
                    ))}
                </div>
            </section>

            <CTASection
                buttonText="Try Practice Quiz"
                videoSrc="/videos/tryQuizBanner.mp4"
                link="/quiz/mock/register"
            />

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

            <section className="matters-container">
                <div className="container">
                    <h2 className="section-title">Why It Matters</h2>

                    <p className="intro">
                        Because today&apos;s world doesn&apos;t need more people with memorized answers — it needs people who
                        can think for themselves.
                    </p>

                    <span>In the league of logic, your child will:</span>
                    <ul className="benefits">
                        <li>
                            <span className="icon">✔</span>
                            Strengthen strategic and logical reasoning skills
                        </li>
                        <li>
                            <span className="icon">✔</span>
                            Learn to approach problems with clarity and structure
                        </li>
                        <li>
                            <span className="icon">✔</span>
                            Develop lifelong habits of careful planning, analysis, and decision-making
                        </li>
                    </ul>

                    <p className="highlight">
                        Because no matter your age or grade, logic is your superpower.And in the League of Logic, we
                        don&apos;t just test it — we train it, grow it, and celebrate it.
                    </p>

                    <p className="closing">
                        Whether you&apos;re a future coder, creator, entrepreneur, or simply a curious mind — this challenge
                        is your stage.
                    </p>
                </div>
            </section>

            <section className="rewards">
                <div className="container">
                    <h2 className="section-title">Rewards</h2>

                    <div className="rewards-grid">
                        <div className="reward-card">
                            <video autoPlay muted loop playsInline>
                                <source src="/videos/homeVoucher.mp4" type="video/mp4" />
                            </video>
                            <div className="reward-content">
                                <div>
                                    <h3>AED 500 Voucher for Group Toppers in:</h3>
                                    <ul>
                                        <li>Grade 3-4</li>
                                        <li>Grade 5-6</li>
                                        <li>Grade 7-8</li>
                                        <li>Grade 9-10</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="reward-card">
                            <video autoPlay muted loop playsInline>
                                <source src="/videos/homeRobotics.mp4" type="video/mp4" />
                            </video>
                            <div className="reward-content">
                                <div>
                                    <h3>1-2 Week Robotic Camps in December for all Group Toppers!</h3>
                                    <p className="subtext">
                                        <em>(Learn, build, and play with real robots!)</em>
                                    </p>
                                    <p>
                                        A sponsored spot at an exclusive Robotics Camp — where your logic takes control
                                        of circuits, wheels, and real-world fun.
                                    </p>
                                </div>
                                <a href="/rewards" className="more-link">
                                    More Rewards {'>'}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="register">
                <h3>How to register?</h3>
                <div className="video-placeholder">
                    <div className="video-box"></div>
                </div>
            </section>

            <CTASection buttonText="Register Now" videoSrc="/videos/tryQuizBanner.mp4" link="/register" />

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
