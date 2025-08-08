'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import useAppStore from '@/store/store';
import './header.scss';

const Header = () => {
    const setStep = useAppStore((state) => state.setStep);
    const [menuOpen, setMenuOpen] = useState(false);

    const { data: session } = useSession();

    const pathname = usePathname();

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
                    <li className={`link ${pathname.includes('/quiz/mock') ? 'active' : ''}`}>
                        <Link href="/quiz/mock/register" onClick={() => setMenuOpen(false)}>
                            Practice Quiz
                        </Link>
                    </li>

                    <li className={`link ${pathname === '/quiz/contest/rewards' ? 'active' : ''}`}>
                        <Link href="/quiz/contest/rewards" onClick={() => setMenuOpen(false)}>
                            Rewards
                        </Link>
                    </li>

                    <li className={`link ${pathname === '/contact' ? 'active' : ''}`}>
                        <Link href="/contact" onClick={() => setMenuOpen(false)}>
                            Contact
                        </Link>
                    </li>

                    {!isLoggedIn ? (
                        <>
                            <li className={`link ${pathname === '/register' ? 'active' : ''}`}>
                                <Link
                                    href="/register"
                                    onClick={() => {
                                        setStep(1);
                                        setMenuOpen(false);
                                    }}
                                >
                                    Register
                                </Link>
                            </li>
                            <li className={`link ${pathname === '/login' ? 'active' : ''}`}>
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

                            <li className="link username">
                                <Link href="/" onClick={() => setMenuOpen(false)}>
                                    {session.user.name}
                                </Link>
                            </li>
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
