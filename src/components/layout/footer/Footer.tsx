import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './footer.scss';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-top">
                <Image
                    width={60}
                    height={60}
                    src="/images/logo2.png"
                    alt="Ei Logo"
                    className="footer-logo"
                />
                <div>
                    <Link href="/">League of Logic</Link>
                    <Link href="/quiz/mock/register">Practice Test</Link>
                    <Link href="/quiz/contest/rewards">Rewards</Link>
                </div>
                <div>
                    <Link href="/contact">Contact Us</Link>
                    <Link href="https://ct.ei-usa.com/faq">About Ei</Link>
                    <Link href="https://ei.study/">FAQ</Link>
                </div>
                <div>
                    <a href="https://www.facebook.com/profile.php?id=61566872191409" target="_blank" rel="noopener noreferrer">
                        Facebook
                    </a>
                    <a href="https://x.com/eistudy1" target="_blank" rel="noopener noreferrer">
                        Twitter
                    </a>
                    <a href="https://www.instagram.com/eistudy1" target="_blank" rel="noopener noreferrer">
                        Instagram
                    </a>
                    <a href="https://www.youtube.com/eivideos" target="_blank" rel="noopener noreferrer">
                        YouTube
                    </a>
                    <a href="https://www.linkedin.com/company/eistudy/posts/?feedView=all" target="_blank" rel="noopener noreferrer">
                        LinkedIn
                    </a>
                </div>
            </div>

            <div className="footer-bottom">
                <span>Copyright &copy; 2022 Ei.</span>
                <span>
                    <Link href="/terms-and-conditions">Terms of use</Link> |{' '}
                    <Link href="/privacy-policy">Privacy Policy</Link> |{' '}
                    <Link href="/refund-policy">Refund Policy</Link>
                </span>
            </div>
        </footer>
    );
};

export default Footer;
