import React from 'react';
import './welcome.scss';

const faqs = [
    {
        question: 'Q - Sample text this is the sample text.hello sample text Sample text this is the sample text...',
        answer:
            'Sample text this is the sample text.hello sample text Sample text this is the sample text.hello sample text Sample text this is the sample text.',
    },
    {
        question: 'Q - Sample text this is the sample text.hello sample text Sample text this is the sample text...',
        answer:
            'Sample text this is the sample text.hello sample text Sample text this is the sample text.hello sample text Sample text this is the sample text.',
    },
    {
        question: 'Q - Sample text this is the sample text.hello sample text Sample text this is the sample text...',
        answer:
            'Sample text this is the sample text.hello sample text Sample text this is the sample text.hello sample text Sample text this is the sample text.',
    },
];

const Page = () => {
    return (
        <div className="welcome-container">
            <div className="banner">
                <h1>Welcome to the League of Logic.</h1>
            </div>

            <section className="info-section">
                <h3>Important Information</h3>
                <p><strong>Test Date -</strong> To be announced</p>
                <p><strong>Time -</strong> 4:00 PM to 5:00 PM (local time)</p>
                <p><strong>System Requirements -</strong> Desktop/Laptop with stable internet connection and Chrome browser</p>
            </section>

            <section className="faq-section">
                <h3>FAQ</h3>
                {faqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                        <div className="faq-question"><strong>{faq.question}</strong></div>
                        <div className="faq-answer">{faq.answer}</div>
                    </div>
                ))}
            </section>

            <section className="contact-section">
                <h3>Contact Us</h3>
                <p>
                    If you have any queries, feel free to email us at{' '}
                    <a href="mailto:competition@ei.study">competition@ei.study</a>
                </p>
            </section>
        </div>
    );
};

export default Page;
