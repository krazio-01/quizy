import RewardsSection from '@/components/layout/rewards/RewardsSection';
import Image from 'next/image';
import CTASection from '@/components/layout/CTASection/CTASection';
import './rewards.scss';

const partnersData = [
    {
        text: [
            'As our key UAE partner, Sage leads programs like Ei ASSET, Ei Mindspark, and the League of Logic, nurturing critical thinking and problem-solving skills. This year, rewards for top performers are even more exciting. League of Logic toppers receive fully sponsored access to hands-on Robotics Courses, applying their logical thinking in real-world innovation through design and building.',
            'All participants can also enjoy a special discounted rate with their participation certificate, accessing learning that inspires creativity, technical skills, and practical problem-solving.',
        ],
        imagePosition: 'left',
        image: '/images/rewards1.png',
    },
    {
        text: [
            "GenWise is a leading learning community that connects students with some of India's finest educators, offering programs that nurture critical thinking, creativity, and real-world problem-solving. For students in Grades 3-4, AI Explorers: Patterns, Rules and Play introduces foundational AI concepts through playful learning. Grades 5-6 can dive into AI Tinkerers: Algorithm Adventures, exploring algorithms and computational thinking through hands-on challenges. Older students in Grades 7-10 can participate in GenAI Essentials for Teens, developing skills to think, create, and build with AI. These programs go beyond the classroom to inspire curiosity, innovation, and lifelong learning.",
        ],
        imagePosition: 'right',
        image: '/images/rewards2.png',
    },
];

const Page = async () => {
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
                <RewardsSection title="Top Rewards" />
            </div>

            <section className="extra-rewards">
                <h2>Extra Rewards That Spark Success</h2>
                <div className="rewards-grid">
                    <div className="reward-item">
                        <h4>Digital Certificates for all participants.</h4>
                        <img src="/images/certificate.png" alt="Digital Certificate" />
                        <p>
                            All participants will receive digital certificates, while class toppers will be awarded
                            special certificates delivered to their school
                        </p>
                    </div>
                    <div className="reward-item">
                        <h4>Medals for toppers</h4>
                        <img src="/images/rewardsmedals.png" alt="medals" />
                        <p>
                            All class toppers will be proudly awarded shiny gold medals, which will be carefully sent to
                            their schools for distribution.
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
                            <video loop src="/videos/rewardsReportDesktop.mp4" className="desktop-video" />
                            <video loop src="/videos/report.mp4" className="mobile-video" />
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
                            Ei ATS is not for every student, but being in the League of Logic means you&apos;re closer
                            than most.
                        </p>
                    </div>
                </div>
            </section>

            <CTASection buttonText="Register Now" link="/register" videoSrc="/videos/homepageBanner2.mp4" />

            <section className="whatif-section">
                <h2 className="title">What if my child doesn&apos;t win?</h2>
                <p className="subtitle space">
                    In the League of Logic, there are no losers. Every child who participates leaves with something far
                    more valuable than medals or ranks — sharper thinking, stronger confidence, and a mindset built to
                    thrive in school and in life.
                </p>
                <p>
                    <strong>Think about it:</strong> How often do children spend hours online with little to show for
                    it? For the cost of a single fast-food meal or an evening of screen time, your child can invest in
                    an experience that boosts their brain, strengthens their confidence, and prepares them for
                    challenges well beyond the classroom.
                </p>
                <p className="subtitle">In the League of Logic, every child wins in ways that matter most.</p>

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
                        Join the League of Logic today — and give your child the gift of confidence, capability, and
                        curiosity.
                    </p>
                </div>
            </section>

            <section className="exposure-partners-container">
                <h3>Our exposure partners</h3>
                {partnersData.map((partner, index) => (
                    <div key={index} className={`partner-row ${partner.imagePosition === 'right' ? 'reverse' : ''}`}>
                        <div className="image">
                            <Image width={300} height={300} alt="rewards img" src={partner.image} />
                        </div>
                        <p className="partner-text">
                            {partner.text.map((part, i) => (
                                <span key={i}>
                                    {part}
                                    {i < partner.text.length - 1 && <br />}
                                    {i < partner.text.length - 1 && <br />}
                                </span>
                            ))}
                        </p>
                    </div>
                ))}
            </section>
        </div>
    );
};

export default Page;
