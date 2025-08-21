import React from 'react';
import './rewardsSection.scss';

const RewardsSection = () => {
    return (
        <section className="rewards-container">
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
    )
}

export default RewardsSection;
