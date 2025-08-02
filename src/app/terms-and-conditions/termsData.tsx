import Link from 'next/link';

export const termsSections = [
    {
        title: '1. Acceptance of Terms',
        content:
            'By accessing and using the League of Logic competition website (the "Site"), you agree to comply with and be bound by these Terms of Use.',
    },
    {
        title: '2. Registration and Fees',
        subSections: [
            {
                subtitle: '2.1 Registration and Fees',
                content:
                    "To participate in the League of Logic competition, you must register on the Site and pay the registration fee, which is 49 AED (United Arab Emirates Dirhams) or an equivalent amount as per your country's currency.",
            },
            {
                subtitle: '2.2 Payment',
                content: 'Only online payment is accepted.',
            },
        ],
    },
    {
        title: '3. Eligibility',
        subSections: [
            {
                subtitle: '3.1 Eligibility',
                content: 'The League of Logic competition is open to students in grades 3 to 10.',
            },
        ],
    },
    {
        title: '4. User Conduct',
        subSections: [
            {
                subtitle: '4.1 Conduct',
                content: 'Users of the Site must conduct themselves in a respectful and lawful manner.',
            },
            {
                subtitle: '4.2 Prohibited Activities',
                content:
                    'Users are prohibited from engaging in any activity that may harm the Site, its content, or other users.',
            },
        ],
    },
    {
        title: '5. Intellectual Property',
        subSections: [
            {
                subtitle: '5.1 Property Rights',
                content:
                    'All content on the Site, including text, graphics, logos, images, audio, and video materials, are the property of Educational Initiatives Pvt Limited and are protected by copyright and other intellectual property laws.',
            },
            {
                subtitle: '',
                content:
                    'EI reserves the right to cancel, suspend, postpone this competition, rewards, test, promotions, etc. at its discretion and without any prenotice. - To qualify for consideration in any award category, there must be a minimum of 300 candidates enrolled and actively participating in each respective grade.',
            },
            {
                subtitle: '',
                content:
                    'All content on the Site, including text, graphics, logos, images, audio, and video materials, are the property of Educational Initiatives Pvt Limited and are protected by copyright and other intellectual property laws.',
            },
        ],
    },
    {
        title: '6. Privacy',
        subSections: [
            {
                subtitle: '6.1 Privacy Policy',
                content: (
                    <>
                        User information is collected and used in accordance with our&nbsp;
                        <Link href="/privacy-policy">Privacy Policy</Link>.
                    </>
                ),
            },
        ],
    },
    {
        title: '7. Limitation of Liability',
        subSections: [
            {
                subtitle: '7.1 Liability',
                content:
                    'Educational Initiatives Pvt Limited and its affiliates are not responsible for any direct, indirect, incidental, consequential, or punitive damages arising from the use of the Site or participation in the League of Logic competition.',
            },
        ],
    },
    {
        title: '8. Changes to Terms',
        subSections: [
            {
                subtitle: '8.1 Modification of Terms',
                content:
                    'Educational Initiatives Pvt Limited reserves the right to modify or amend these Terms of Use at any time. It is your responsibility to regularly review these terms to stay informed of any changes.',
            },
        ],
    },
    {
        title: '9. Termination',
        subSections: [
            {
                subtitle: '9.1 Termination',
                content:
                    'Educational Initiatives Pvt Limited reserves the right to terminate or suspend your access to the Site and the League of Logic competition at its discretion, without prior notice.',
            },
        ],
    },
    {
        title: '10. Governing Law',
        subSections: [
            {
                subtitle: '10.1 Governing Law and Jurisdiction',
                content:
                    'These Terms of Use are governed by and construed in accordance with the laws of India, and jurisdiction is Ahmedabad in India.',
            },
        ],
    },
    {
        title: '11. Contact Us',
        subSections: [
            {
                subtitle: '11.1 Contact Information',
                content: (
                    <>
                        If you have any questions or concerns regarding these Terms of Use, please contact us at{' '}
                        <a href="mailto:competitions@ei.study">competition@ei.study</a>.
                    </>
                ),
            },
        ],
    },
];
