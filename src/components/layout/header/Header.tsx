'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { useSession, signOut } from 'next-auth/react';
import './header.scss';

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { data: session } = useSession();

    const isLoggedIn = !!session?.user;

    const handleLogout = async () => {
        await signOut({ callbackUrl: '/' });
    };

    return (
        <nav className="navbar-container">
            <div className="logo">
                <Link href="/">
                    <Image src="/images/logo.png" alt="logo" width={200} height={45} />
                </Link>
            </div>

            <div className={`links-container ${menuOpen ? 'open' : ''}`}>
                <ul>
                    <li className="link">
                        <Link href="/quiz/mock/register" onClick={() => setMenuOpen(false)}>
                            Practice Quiz
                        </Link>
                    </li>

                    {!isLoggedIn ? (
                        <>
                            <li className="link">
                                <Link href="/register" onClick={() => setMenuOpen(false)}>
                                    Register
                                </Link>
                            </li>
                            <li className="link">
                                <Link href="/login" onClick={() => setMenuOpen(false)}>
                                    Login
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="link">
                                <div className="logout-btn">
                                    <button onClick={handleLogout}>Logout</button>
                                </div>
                            </li>

                            <Link href="/" onClick={() => setMenuOpen(false)}>
                                {session.user.name}
                            </Link>

                        </>
                    )}
                </ul>
            </div>

            <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </div>
        </nav>
    );
};

export default Header;
