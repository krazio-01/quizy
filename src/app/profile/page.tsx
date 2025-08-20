'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './profile.scss';

interface UserDetails {
    name: string;
    email: string;
    profilePhoto: string;
    billing: {
        description: string;
        hsn: string;
        qty: number;
        rate: number;
        igst: string;
        igstAmount: number;
        paidAmount: number;
        status: string;
    };
}

const ProfilePage = () => {
    const [user, setUser] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get<UserDetails>('/api/user/details');
                console.log('md-res:', res.data);
                setUser(res.data);
            } catch (error) {
                console.error('Failed to fetch user details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    if (loading) return <div className="profile-page loading">Loading...</div>;

    if (!user) return <div className="profile-page error">No user data available</div>;

    return (
        <div className="profile-page">
            <aside className="sidebar">
                <div className="user-info">
                    <img src={'/images/avatar.png'} alt="User" className="avatar" />
                    <div>
                        <span className="username">{user.name.split(' ')[0]}</span>
                        <span className="role">User</span>
                    </div>
                </div>
                <nav className="menu">
                    <button>Test Guidelines</button>
                    <button>Invoice</button>
                    <button>Certificate</button>
                </nav>
            </aside>

            <main className="content">
                <header className="header">
                    <h2>
                        Welcome, <span>{user.name.split(' ')[0]}</span>
                    </h2>
                </header>

                <section className="profile-section">
                    <h3>Your Profile</h3>

                    <div className="profile-photo">
                        <div>
                            <span>Profile Photo</span>
                            <img src={'/images/avatar.png'} alt="Profile" />
                        </div>
                        <div>
                            <span>Profile Photo</span>
                            <button className="change-btn">Change Photo</button>
                        </div>
                    </div>

                    <div className="field">
                        <div>
                            <span className="label">Name</span>
                            <span className="value">{user.name}</span>
                        </div>
                        <button className="edit-btn">Edit</button>
                    </div>
                    <div className="field">
                        <div>
                            <span className="label">Email Address</span>
                            <span className="value">{user.email}</span>
                        </div>
                        <button className="edit-btn">Edit</button>
                    </div>

                    <div className="billing">
                        <h4>Billing</h4>

                        {!user.billing ? (
                            <div className="billing__empty">No billing information available.</div>
                        ) : (
                            <div className="billing__card">
                                <div className="billing__header">
                                    <span>Description</span>
                                    <span>HSN/SAC</span>
                                    <span>Qty</span>
                                    <span>Rate (AED)</span>
                                    <span>IGST</span>
                                    <span>Amount</span>
                                </div>

                                <div className="billing__row">
                                    <span>{user.billing.description}</span>
                                    <span>{user.billing.hsn}</span>
                                    <span>{user.billing.qty}</span>
                                    <span>{user.billing.rate}</span>
                                    <span>
                                        {user.billing.igst} ({user.billing.igstAmount})
                                    </span>
                                    <span>{user.billing.paidAmount}</span>
                                </div>
                            </div>
                        )}

                        {user.billing && (
                            <div className="status">
                                Fees Status <span className="check">✔</span>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProfilePage;
