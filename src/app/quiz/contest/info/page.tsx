import './info.scss';

const faqs = [
    {
        question: 'Q - What is the League of Logic competition?',
        answer: 'The League of Logic is a global competition open to students in grades 3-10 from all curriculums.',
    },
    {
        question: 'Q - How will the competition be conducted?',
        answer: 'The competition will be proctored, and results will be announced for each participating grade.',
    },
    {
        question: 'Q - How will winners be selected?',
        answer: 'Winners will be chosen based on their performance in the competition.',
    },
    {
        question: 'Q - How can I contact or clear doubts about the competition?',
        answer: 'For any inquiries or doubts, you can send an email to competition@ei.study.',
    },
    {
        question: 'Q - Is there a video guide for registration?',
        answer: 'Yes, there is a registration guideline video available. You can watch it on this link under "Learn the Registration process."',
    },
    {
        question: 'Q - What technology is required to participate?',
        answer: 'To participate, you will need a laptop, a stable internet connection (Wi-Fi), and a working camera on your desktop or laptop.',
    },
    {
        question: 'Q - How will awards be delivered to participants?',
        answer: "Awards will be sent either directly to the selected school or to the individual's address. Ensure that you provide the correct email address and phone number for delivery.",
    },
    {
        question: 'Q - How long is the duration of the exam?',
        answer: 'The exam duration is 60 minutes.',
    },
    {
        question: 'Q - When is the exam date for the League of Logic competition?',
        answer: 'The exam is scheduled for October 11th and 12th, 2025.',
    },
    {
        question: 'Q - What is the registration fee, and how does it work for different countries?',
        answer: 'The registration fee is 75 AED, and it will appear in the currency equivalent to your country of registration.',
    },
    {
        question: 'Q - Are practice papers available for participants?',
        answer: 'Yes, practice papers are available for all users, and registered users can access extra questions based on their registered grade.',
    },
    {
        question: 'Q - How can parents support their children in the competition?',
        answer: 'Parents can help by ensuring their children have the necessary technology and equipment required for the competition.',
    },
];

const Page = () => {
    return (
        <div className="welcome-container">
            <div className="banner">
                <video autoPlay muted loop playsInline className="welcome-video">
                    <source src="/videos/contestWelcome.mp4" type="video/mp4" />
                </video>
                <h1>Welcome to the League of Logic.</h1>
            </div>

            <section className="info-section">
                <h3>Important Information</h3>
                <p>
                    <strong>Test Date -</strong>
                </p>
                <p>
                    <strong>Time -</strong>
                </p>
                <p>
                    <strong>System Requirements -</strong>
                </p>
            </section>

            <section className="faq-section">
                <h3>FAQ</h3>
                {faqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                        <div className="faq-question">
                            <strong>{faq.question}</strong>
                        </div>
                        <div className="faq-answer">{faq.answer}</div>
                    </div>
                ))}
            </section>

            <section className="contact-section">
                <h3>Contact Us</h3>
                <div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </section>
        </div>
    );
};

export default Page;
