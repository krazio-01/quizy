'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import './header.scss';

const HEADER_LINKS = [
    { name: 'Practice Quiz', link: '/quiz/mock/register' },
    { name: 'Register', link: '/register' },
    { name: 'Login', link: '/login' },
];

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <nav className="navbar-container">
            <div className="logo">
                <Link href="/">
                    <Image src="/images/logo.png" alt="logo" width={200} height={45} />
                </Link>
            </div>

            <div className={`links-container ${menuOpen ? 'open' : ''}`}>
                <ul>
                    {HEADER_LINKS.map((link, index) => (
                        <li className="link" key={index}>
                            <Link href={link.link} onClick={() => setMenuOpen(false)}>
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </div>
        </nav>
    );
};

export default Header;
