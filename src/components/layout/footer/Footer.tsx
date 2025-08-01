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
                    <Link href="/quiz/register">League of Logic</Link>
                    <Link href="/practice">Practice Test</Link>
                    <Link href="/awards">Awards</Link>
                </div>
                <div>
                    <Link href="/contact">Contact Us</Link>
                    <Link href="/about">About Ei</Link>
                    <Link href="/faq">FAQ</Link>
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
