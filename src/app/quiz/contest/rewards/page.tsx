import React from 'react';
import RewardsSection from '@/components/layout/rewards/RewardsSection';
import Image from 'next/image';
import CTASection from '@/components/layout/CTASection/CTASection';
import './rewards.scss';

const partnersData = [
    {
        text: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat. Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur. Excepteur Sint Occaecat Cupidatat Non Proident, Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum.',
        imagePosition: 'left',
    },
    {
        text: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat. Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur. Excepteur Sint Occaecat Cupidatat Non Proident, Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum.',
        imagePosition: 'right',
    },
    {
        text: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat. Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur. Excepteur Sint Occaecat Cupidatat Non Proident, Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum.',
        imagePosition: 'left',
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

            <RewardsSection title="Top Rewards for Group Toppers" />

            <section className="extra-rewards">
                <h2>Extra Rewards That Spark Success</h2>
                <div className="rewards-grid">
                    <div className="reward-item">
                        <h4>Digital Certificates for all participants</h4>
                        <img src="/images/certificate.png" alt="Digital Certificate" />
                        <p>Sample text this is the sample text.hello sample text</p>
                    </div>
                    <div className="reward-item">
                        <h4>Personalized Student Report</h4>
                        <video autoPlay muted loop playsInline>
                            <source src="/videos/medals.mp4" type="video/mp4" />
                        </video>
                        <p>Sample text this is the sample text.hello sample text</p>
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
                        <div className="bonus-image">
                            <img src="/images/learning-bonus.png" alt="Learning Bonus" />
                        </div>
                        <h3>Learning bonuses</h3>
                        <p>
                            Free Masterclass by GenWise if you top your class, because great
                            thinking deserves great mentoring.
                        </p>
                    </div>

                    <div className="bonus-card">
                        <div className="bonus-image">
                            <img src="/images/get-recognized.png" alt="Get Recognized" />
                        </div>
                        <h3>Get Recognized!</h3>
                        <p>
                            Your name goes up on our Hall of Honour and social media because the
                            world should see when brilliance happens.
                        </p>
                    </div>
                </div>

                <div className="asset-discount">
                    <div className="asset-image">
                        <img src="/images/ei-asset.png" alt="Ei Asset Talent Search" />
                    </div>
                    <div className="asset-content">
                        <h3>Discount on Ei ASSET Talent Search (Ei ATS).</h3>
                        <p>
                            Score above the 85th percentile in League of Logic, and your child
                            gets a discounted entry into Ei ATS, a stage for India’s most
                            promising young minds. It’s where high performers unlock:
                        </p>
                        <ul>
                            <li>Leadership tracks</li>
                            <li>Advanced academic challenges</li>
                            <li>A badge of talent that stands out everywhere</li>
                        </ul>
                        <p>
                            Ei ATS is not for every student, but being in the League of Logic
                            means you're closer than most.
                        </p>
                    </div>
                </div>
            </section>

            <CTASection buttonText='Register Now' link='/register' videoSrc='/videos/homepageBanner2.mp4' />

            <section className="exposure-partners-container">
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
