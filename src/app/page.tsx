import React from 'react';
import Image from 'next/image';
import StatsBar from '@/components/UI/StatsBar/StatsBar';
import MotionDiv from '@/components/Animated/MotionDiv';
import CTASection from '@/components/layout/CTASection/CTASection';
import RewardsSection from '@/components/layout/rewards/RewardsSection';
import './home.scss';

const Cards = ({ title, description, icon }: { title: string; description: string; icon?: string }) => (
    <div className="card">
        {icon && <Image src={icon} alt="Card Icon" width={50} height={50} className="card-icon" />}
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
        title: 'Future-ready skills',
        description:
            'Go beyond textbooks and exams — equip your child with critical thinking, creativity, and problem-solving abilities that are vital for the 21st century.',
        icon: '/images/home/icon1.png',
    },
    {
        title: 'Global recognition',
        description:
            'Compete with peers from over 120 countries, earn certificates and badges, and showcase achievements that stand out on school and career applications.',
        icon: '/images/home/icon2.png',
    },
    {
        title: 'Fun challenges',
        description:
            'Interactive, thought-provoking challenges designed to build confidence, logical reasoning, and innovative thinking for lifelong success.',
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

            <section className="stats-container">
                <div>120+ <br/> countries</div>
                <div>Recognition <br />Certificates &amp; medals</div>
                <div>Growth &amp; Rewards <br />Career Boost &amp; Prizes</div>
                <div>Test date: <br />11-12th Oct</div>
            </section>

            <section className="potential">
                <div className="potential-wrapper">
                    <video autoPlay muted loop playsInline>
                        <source src="/videos/Kids.mp4" type="video/mp4" />
                    </video>
                    <div className="text">
                        <h2>Are they ready to think outside the box?</h2>
                        <p>
                            The League of Logic is a global online competition that helps students in Grades 3 to 10
                            build essential skills for life — critical thinking, logical reasoning, and problem-solving
                            — across all curricula.
                        </p>
                        <p>
                            In a world that is changing faster than ever, academic success alone is not enough. Children
                            need the ability to think independently, approach challenges creatively, and apply logic to
                            real-world situations. The League of Logic goes beyond traditional exams, focusing on
                            developing the cognitive skills that prepare students to thrive in the 21st century. It is
                            not just a competition, but a journey to unlock potential and prepare young minds for the
                            future.
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
                bannerText={{
                    text: 'See how sharp your logical thinking is!',
                    style: { fontSize: 'var(--fz-xl)', width: '350px' },
                }}
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
                                Introduces younger students to structured thinking in a simple, engaging way. Tasks are
                                focused on helping them identify patterns, follow sequences, and understand logical
                                relationships.
                            </p>
                        </div>
                        <div className="grade-card">
                            <h4>Grades 5 &amp; 6</h4>
                            <p>
                                Challenges deepen in complexity, helping students build computational thinking
                                strategies like decomposition, pattern recognition, and stepwise reasoning.
                            </p>
                        </div>
                        <div className="grade-card">
                            <h4>Grades 7 &amp; 8</h4>
                            <p>
                                Students deal with open-ended, logic-driven scenarios that require methodical thinking
                                and adaptability. These challenges simulate the cognitive demands of upper middle school
                                and real-life thinking.
                            </p>
                        </div>
                        <div className="grade-card">
                            <h4>Grades 9 &amp; 10</h4>
                            <p>
                                Students face real-world style challenges that integrate critical reasoning with
                                analytical decision-making. This level prepares students for high school-level academic
                                reasoning and future problem-solving beyond school.
                            </p>
                        </div>
                    </div>
                </MotionDiv>
            </section>

            <section className="info-section">
                <h2>Preparing Young Minds to Thrive</h2>

                <p>
                    Today&apos;s world doesn&apos;t need more people with memorized answers; it needs individuals who
                    can think for themselves. In the League of Logic, your child will strengthen strategic and logical
                    reasoning, learn to approach problems with clarity and structure, and develop lifelong habits of
                    careful planning, analysis, and decision-making. Logic is a superpower at any age or grade, and in
                    the League of Logic, we don&apos;t just test it — we train it, grow it, and celebrate it. Whether
                    your child is a future coder, creator, entrepreneur, or simply a curious mind, this challenge is
                    their stage to shine.
                </p>
            </section>

            <RewardsSection title="Rewards" showLink={true} />

            <section className="register">
                <h3>How to Register?</h3>
                <div className="video-placeholder">
                    <div className="video-box"></div>
                </div>
            </section>

            <CTASection
                buttonText="Register Now"
                bannerText={{
                    text: 'Give your child the chance to shine globally and build future-ready skills',
                    style: { fontSize: 'var(--fz-lg)', width: '350px' },
                }}
                videoSrc="/videos/homepageBanner2.mp4"
                link="/register"
            />

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
