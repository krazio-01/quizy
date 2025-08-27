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
                    <Link href="/">About Ei</Link>
                    <Link href="/">FAQ</Link>
                </div>
                <div>
                    <Link href="/facebook">Facebook</Link>
                    <Link href="/twitter">Twitter</Link>
                    <Link href="/instagram">Instagram</Link>
                    <Link href="/youtube">YouTube</Link>
                    <Link href="/linkedin">LinkedIn</Link>
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
