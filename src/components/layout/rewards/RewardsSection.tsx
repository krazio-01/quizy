import Link from 'next/link';
import Image from 'next/image';
import './rewardsSection.scss';

const RewardsSection = ({ title, showLink = false, secondRewardTitle = '', secondRewardContent = '' }) => {
    return (
        <section className="rewards">
            <div className="container">
                <h2 className="section-title">{title}</h2>

                <div className="rewards-grid">
                    <div className="reward-card">
                        <Image width={300} height={300} alt="voucher" src="/images/rewardsVoucher.png" />
                        <div className="reward-content">
                            <div>
                                <h3>AED 500 Amazon Vouchers for all Class Toppers</h3>
                                <p className="marker">
                                    All class toppers will receive AED 500 Amazon vouchers, or the equivalent in their
                                    local currency, as a reward for their exceptional performance. This celebrates their
                                    dedication, hard work, and effort in the test.
                                </p>
                                <p>
                                    The vouchers can be used to explore a wide range of products and resources, giving
                                    students the freedom to choose something that inspires their learning journey.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="reward-card">
                        <video autoPlay muted loop playsInline>
                            <source src="/videos/homeRobotics.mp4" type="video/mp4" />
                        </video>
                        <div className="reward-content">
                            <div>
                                {secondRewardTitle !== '' ? (
                                    <h3>{secondRewardTitle}</h3>
                                ) : (
                                    <h3>
                                        2 Week in person Robotic Camps worth AED 1300 in December for Group Toppers!
                                    </h3>
                                )}
                                {secondRewardContent !== '' ? (
                                    <p className="subtext">{secondRewardContent}</p>
                                ) : (
                                    <p className="subtext">
                                        An exciting opportunity for the top performers of the League of Logic Four lucky
                                        Group toppers will win courses worth 1300 AED! These engaging courses provide a
                                        hands-on learning space where kids can dive into the world of robots, coding,
                                        and STEM through age-appropriate activities. Students will have the opportunity
                                        to program robots, design circuits, and solve fun challenges while building
                                        creativity, problem-solving, and logical thinking skills.
                                    </p>
                                )}
                            </div>
                            {showLink && (
                                <Link href="/quiz/contest/rewards" className="more-link">
                                    More Rewards {'>'}
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RewardsSection;
