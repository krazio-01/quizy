import React from 'react';
import RewardsSection from '@/components/layout/rewards/RewardsSection';
import Image from 'next/image';
import CTASection from '@/components/layout/CTASection/CTASection';
import './rewards.scss';

const partnersData = [
    {
        text: 'RoboFunLab is an innovative learning space where children dive into robotics, coding, and hands-on STEM through engaging, age-appropriate courses. With a focus on creativity, problem-solving, and logical reasoning, the programs help kids go beyond theory to build real projects and gain future-ready skills. From programming robots to designing circuits, every course sparks curiosity and confidence—empowering young learners to thrive in a tech-driven world. And here’s the best part: top performers from the League of Logic will get sponsored access to RoboFunLab courses, opening doors to even greater learning opportunities.',
        imagePosition: 'left',
    },
    {
        text: 'GenWise is a learning community that brings together some of India’s finest educators to mentor curious, motivated students. With a focus on critical thinking, exploration, and lifelong learning, GenWise creates programs that go beyond school to nurture intellectual growth and real-world problem-solving. And for League of Logic toppers, there’s a special reward: a free Masterclass with GenWise—because great thinking deserves great mentoring.',
        imagePosition: 'right',
    },
];

const Page = () => {
    return (
        <div className="rewards-container">
            <div className="banner">
                <video autoPlay muted loop playsInline className="rewards-video">
                    <source src="/videos/banner2.mp4" type="video/mp4" />
                </video>

                <h1>
                    Where Brains
                    <br />
                    Meet Big Rewards!
                </h1>
            </div>

            <div className="rewards-wrapper">
                <RewardsSection title="Top Rewards for Group Toppers" />
            </div>

            <section className="extra-rewards">
                <h2>Extra Rewards That Spark Success</h2>
                <div className="rewards-grid">
                    <div className="reward-item">
                        <h4>Digital Certificates for all participants</h4>
                        <img src="/images/certificate.png" alt="Digital Certificate" />
                        <p>A digital certificate, designed to spotlight your problem-solving superpower</p>
                    </div>
                    <div className="reward-item">
                        <h4>Personalized Student Report</h4>
                        <video autoPlay muted loop playsInline>
                            <source src="/videos/medals.mp4" type="video/mp4" />
                        </video>
                        <p>
                            Gold medals for group toppers, silver medals for class toppers and bronze for 2nd in class.
                            Real, proud-to-hold reminder that you cracked it.
                        </p>
                    </div>
                </div>
            </section>

            <section className="personalized-report">
                <div className="container">
                    <h2 className="section-title">Fully Personalized Report</h2>
                    <p className="section-subtitle">
                        A personalized thinking report that doesn&apos;t just reveal your score it shows how you think
                    </p>

                    <div className="report-content">
                        <div className="report-image">
                            <video loop src="/videos/report.mp4" />
                        </div>

                        <div className="report-text">
                            <div className="report-item">
                                <h4>Fully Personalised Feedback</h4>
                                <p>Insights and exercises that target exactly where they need to improve.</p>
                            </div>

                            <div className="report-item">
                                <h4>Clear Skill Mapping</h4>
                                <p>
                                    Visual skill charts make it easy to understand progress and learning gaps in just
                                    one look.
                                </p>
                            </div>

                            <div className="report-item">
                                <h4>Detailed Strengths & Weaknesses Analysis</h4>
                                <p>
                                    Goes beyond scores by pointing the exact concepts the student struggles and aces at.
                                </p>
                            </div>

                            <div className="report-item">
                                <h4>Benchmarking & Progress Tracking</h4>
                                <p>
                                    Track how your child is performing against peers nationwide and monitor real
                                    academic progress.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bonuses">
                <div className="bonuses__grid">
                    <div className="bonus-card">
                        <h3>Learning bonuses</h3>
                        <div className="bonus-video">
                            <video autoPlay loop src="/videos/courses.mp4" />
                        </div>
                        <p>
                            Free Masterclass by GenWise if you top your class, because great thinking deserves great
                            mentoring.
                        </p>
                    </div>

                    <div className="bonus-card">
                        <h3>Get Recognized!</h3>
                        <div className="bonus-video">
                            <video autoPlay loop src="/videos/mic.mp4" />
                        </div>
                        <p>
                            Your name goes up on our Hall of Honour and social media because the world should see when
                            brilliance happens.
                        </p>
                    </div>
                </div>

                <div className="asset-discount">
                    <div className="video-container">
                        <video autoPlay loop src="/videos/talentSearch.mp4" />
                    </div>
                    <div className="asset-content">
                        <h3>Discount on Ei ASSET Talent Search (Ei ATS).</h3>
                        <p>
                            Score above the 85th percentile in League of Logic, and your child gets a discounted entry
                            into Ei ATS, a stage for India&apos;s most promising young minds. It&apos;s where high
                            performers unlock:
                        </p>
                        <ul>
                            <li>Leadership tracks</li>
                            <li>Advanced academic challenges</li>
                            <li>A badge of talent that stands out everywhere</li>
                        </ul>
                        <p>
                            Ei ATS is not for every student, but being in the League of Logic means you&apos;re closer than
                            most.
                        </p>
                    </div>
                </div>
            </section>

            <CTASection buttonText="Register Now" link="/register" videoSrc="/videos/homepageBanner2.mp4" />

            <section className="whatif-section">
                <h2 className="title">What if I don&apos;t win?</h2>
                <p className="subtitle space">
                    Great question. But here&apos;s the thing — in the League of Logic, every participant walks away
                    wiser than they came in. Because this isn&apos;t just about medals and marks, it&apos;s about
                    unlocking the power of thinking. Let&apos;s be honest — AED 75 can be gone in a flash. On a
                    fast-food meal. On screen time.
                </p>
                <p className="subtitle">But what if instead, it bought your child:</p>

                <div className="benefits">
                    <div className="benefit-card">
                        <div className="icon">
                            <Image src="/images/LOL1.png" alt="Brain Icon" width={48} height={48} />
                        </div>
                        <h3>Powerful Hour Of Brain Boosting, Screen-Smart Engagement</h3>
                    </div>

                    <div className="benefit-card">
                        <div className="icon">
                            <Image src="/images/LOL2.png" alt="Brain Icon" width={48} height={48} />
                        </div>
                        <h3>The Confidence That Comes From Solving Something Tricky</h3>
                    </div>

                    <div className="benefit-card">
                        <div className="icon">
                            <Image src="/images/LOL3.png" alt="Brain Icon" width={48} height={48} />
                        </div>
                        <h3>A Mindset That Says, “I Can Crack It If I Think It Through.”</h3>
                    </div>
                </div>

                <div className="closing">
                    <p>
                        Even if your child doesn&apos;t top the charts, they&apos;ll walk away thinking sharper. And
                        that&apos;s more valuable than any rank or reward.
                    </p>
                    <p>
                        Because what we&apos;re really building isn&apos;t just test-takers. We&apos;re building
                        resilient, reflective, real-world thinkers. The kind who stay curious no matter what challenge
                        comes next.
                    </p>
                    <p>So the real answer to the question? If your child doesn&apos;t win… They still win.</p>
                    <p>
                        Join the League of Logic. Watch your child grow in confidence, capability and curiosity. <br />
                        We&apos;ll take care of the rest.
                    </p>
                </div>
            </section>

            <section className="exposure-partners-container">
                <h3>Our exposure partners</h3>
                {partnersData.map((partner, index) => (
                    <div key={index} className={`partner-row ${partner.imagePosition === 'right' ? 'reverse' : ''}`}>
                        <div className="image-placeholder" />
                        <p className="partner-text">{partner.text}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Page;
