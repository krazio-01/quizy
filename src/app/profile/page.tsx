'use client';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import './profile.scss';

interface UserDetails {
    userId: string;
    firstName: string;
    lastName: string;
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
    const [updating, setUpdating] = useState(false);

    const [editMode, setEditMode] = useState<{ field: string | null }>({ field: null });
    const [formData, setFormData] = useState<{ name: string; email: string }>({
        name: '',
        email: '',
    });

    const fetchUser = useCallback(async () => {
        try {
            setLoading(true);
            const { data } = await axios.get<UserDetails>('/api/user/details');
            setUser(data);
            setFormData({
                name: `${data.firstName} ${data.lastName}`.trim(),
                email: data.email,
            });
        } catch (error) {
            toast.error('Failed to fetch user details');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const handleSave = async () => {
        if (!user) return;
        try {
            setUpdating(true);

            const [firstName, ...rest] = formData.name.trim().split(' ');
            const lastName = rest.join(' ');

            const res = await axios.post('/api/user/update', {
                userId: user.userId,
                firstName,
                lastName,
                email: formData.email,
            });

            if (res.status === 200) {
                toast.success('Profile updated successfully');
                await fetchUser();
                setEditMode({ field: null });
            }
        } catch (err) {
            toast.error('Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="profile-page loading">Loading...</div>;

    if (!user) return <div className="profile-page error">No user data available</div>;

    return (
        <div className="profile-page">
            <aside className="sidebar">
                <div className="user-info">
                    <img src={'/images/avatar.png'} alt="User" className="avatar" />
                    <div>
                        <span className="username">{user.firstName}</span>
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
                        Welcome, <span>{user.firstName}</span>
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
                            {editMode.field === 'name' ? (
                                <input
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            ) : (
                                <span className="value">{formData.name}</span>
                            )}
                        </div>
                        {editMode.field === 'name' ? (
                            <button className="edit-btn" onClick={handleSave} disabled={updating}>
                                {updating ? 'Saving...' : 'Save'}
                            </button>
                        ) : (
                            <button className="edit-btn" onClick={() => setEditMode({ field: 'name' })}>Edit</button>
                        )}
                    </div>

                    <div className="field">
                        <div>
                            <span className="label">Email</span>
                            {editMode.field === 'email' ? (
                                <input
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            ) : (
                                <span className="value">{user.email}</span>
                            )}
                        </div>
                        {editMode.field === 'email' ? (
                            <button className="edit-btn" onClick={handleSave} disabled={updating}>
                                {updating ? 'Saving...' : 'Save'}
                            </button>
                        ) : (
                            <button className="edit-btn" onClick={() => setEditMode({ field: 'email' })}>Edit</button>
                        )}
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
