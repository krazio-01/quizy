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

    if (loading) {
        return <div className="profile-page loading">Loading...</div>;
    }

    if (!user) {
        return <div className="profile-page error">No user data available</div>;
    }

    return (
        <div className="profile-page">
            <aside className="sidebar">
                <div className="user-info">
                    <img src={user.profilePhoto || '/images/avatar.png'} alt="User" className="avatar" />
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
                    <a href="/logout" className="logout">
                        Logout
                    </a>
                </header>

                <section className="profile-section">
                    <h3>Your Profile</h3>

                    <div className="profile-photo">
                        <img src={user.profilePhoto || '/images/avatar.png'} alt="Profile" />
                        <button className="change-btn">Change Photo</button>
                    </div>

                    <div className="field">
                        <span className="label">Name</span>
                        <span className="value">{user.name}</span>
                        <button className="edit-btn">Edit</button>
                    </div>
                    <div className="field">
                        <span className="label">Email Address</span>
                        <span className="value">{user.email}</span>
                        <button className="edit-btn">Edit</button>
                    </div>

                    <div className="billing">
                        <h4>Billing</h4>

                        {user.billing ? (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Description</th>
                                        <th>HSN/SAC</th>
                                        <th>Qty</th>
                                        <th>Rate (AED)</th>
                                        <th>IGST</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{user.billing.description}</td>
                                        <td>{user.billing.hsn}</td>
                                        <td>{user.billing.qty}</td>
                                        <td>{user.billing.rate}</td>
                                        <td>
                                            {user.billing.igst} ({user.billing.igstAmount})
                                        </td>
                                        <td>{user.billing.paidAmount}</td>
                                    </tr>
                                </tbody>
                            </table>
                        ) : (
                            <div className="no-billing">
                                No billing information available.
                            </div>
                        )}

                        {user.billing && (
                            <div className="status">
                                <span className="check">✔</span> Fees Status
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProfilePage;
