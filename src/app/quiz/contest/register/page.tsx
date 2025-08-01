import React from 'react';
import Link from 'next/link';
import './register.scss';

const partnersData = [
    {
        text: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat. Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur. Excepteur Sint Occaecat Cupidatat Non Proident, Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum.',
        imagePosition: 'left'
    },
    {
        text: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat. Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur. Excepteur Sint Occaecat Cupidatat Non Proident, Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum.',
        imagePosition: 'right'
    },
    {
        text: 'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat. Duis Aute Irure Dolor In Reprehenderit In Voluptate Velit Esse Cillum Dolore Eu Fugiat Nulla Pariatur. Excepteur Sint Occaecat Cupidatat Non Proident, Sunt In Culpa Qui Officia Deserunt Mollit Anim Id Est Laborum.',
        imagePosition: 'left'
    },
];

const Page = () => {
    return (
        <div className="rewards-container">
            <div className="banner">
                <h1>Where Brains<br />Meet Big Rewards!</h1>
            </div>

            <section className="top-rewards">
                <h2>Top Rewards for Group Toppers</h2>
                <div className="top-rewards-content">
                    <div className="top-reward">
                        <div className="image-placeholder" />
                        <div className="top-rewards-text">
                            <p>AED 500 Voucher for Group Toppers in:</p>
                            <ul>
                                <li>Grade 3-4</li>
                                <li>Grade 5-6</li>
                                <li>Grade 7-8</li>
                                <li>Grade 9-10</li>
                            </ul>
                        </div>
                    </div>
                    <div className="top-reward">
                        <div className="image-placeholder" />
                        <div className="top-rewards-text">
                            <p>1-2 Week Robotic Camps in December for all Group Toppers!</p>
                            <p className="camp-note">(Learn, build, and play with real robots!)</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="extra-rewards">
                <h2>Extra Rewards That Spark Success</h2>
                <div className="rewards-grid">
                    <div className="reward-item">
                        <div className="icon-placeholder" />
                        <h4>Digital Certificates for all participants</h4>
                        <p>Sample text this is the sample text.hello sample text</p>
                    </div>
                    <div className="reward-item">
                        <div className="icon-placeholder" />
                        <h4>Personalized Student Report</h4>
                        <p>Sample text this is the sample text.hello sample text</p>
                    </div>
                    <div className="reward-item">
                        <div className="icon-placeholder" />
                        <h4>Medals for toppers</h4>
                        <p>Sample text this is the sample text.hello sample text</p>
                    </div>
                    <div className="reward-item">
                        <div className="icon-placeholder" />
                        <h4>Learning bonuses</h4>
                        <p>Sample text this is the sample text.hello sample text</p>
                    </div>
                    <div className="reward-item">
                        <div className="icon-placeholder" />
                        <h4>Get Recognized!</h4>
                        <p>Sample text this is the sample text.hello sample text</p>
                    </div>
                </div>
            </section>

            <div className="register-button-container">
                <Link href="/register" className="register-button">
                    Register Now
                </Link>
            </div>

            <section className="exposure-partners-container">
                <h2 className="section-heading">Our exposure partners</h2>

                {partnersData.map((partner, index) => (
                    <div
                        key={index}
                        className={`partner-row ${partner.imagePosition === 'right' ? 'reverse' : ''}`}
                    >
                        <div className="image-placeholder" />
                        <p className="partner-text">{partner.text}</p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Page;
