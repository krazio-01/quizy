'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import axios from 'axios';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FiDownload } from 'react-icons/fi';
import { FiChevronRight } from "react-icons/fi";
import { toast } from 'sonner';
import './profile.scss';

interface UserDetails {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
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
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

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
        } catch {
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
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0] || !user) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            const uploadRes = await axios.post('/api/upload/imgUpload', formData);
            const imgUrl = uploadRes.data.imgUrl;

            await axios.post('/api/user/update', {
                userId: user.userId,
                avatar: imgUrl,
            });

            toast.success('Profile photo updated');
            await fetchUser();
        } catch {
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDownloadInvoice = () => {
        if (!user?.billing) {
            toast.error("No billing information available");
            return;
        }

        const doc = new jsPDF();

        // --- HEADER ---
        doc.setFontSize(22);
        doc.setTextColor(40);
        doc.text("League of Logic", 20, 20);

        doc.setFontSize(14);
        doc.setTextColor(100);
        doc.text("Invoice", 20, 35);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 35);

        // --- USER INFO ---
        doc.setFontSize(12);
        doc.setTextColor(50);
        doc.text(`Name: ${user.firstName} ${user.lastName}`, 20, 50);
        doc.text(`Email: ${user.email}`, 20, 58);

        autoTable(doc, {
            startY: 75,
            head: [["Description", "HSN", "Qty", "Rate (AED)", "IGST", "Amount", "Status"]],
            body: [
                [
                    user.billing.description,
                    user.billing.hsn,
                    user.billing.qty,
                    user.billing.rate,
                    `${user.billing.igst} (${user.billing.igstAmount})`,
                    user.billing.paidAmount,
                    user.billing.status,
                ],
            ],
            theme: "grid",
            headStyles: {
                fillColor: [220, 53, 69],
                textColor: [255, 255, 255],
                halign: "center",
            },
            bodyStyles: { halign: "center" },
        });

        // --- FOOTER ---
        const finalY = (doc as any).lastAutoTable.finalY || 120;
        doc.setFontSize(11);
        doc.setTextColor(120);
        doc.text(
            "Thank you for your payment. Please contact support if you have any questions.",
            20,
            finalY + 20
        );

        doc.save(`invoice-${user.userId}.pdf`);
    };

    if (loading) return <div className="profile-page loading">Loading...</div>;
    if (!user) return <div className="profile-page error">No user data available</div>;

    return (
        <div className="profile-page">
            <aside className="sidebar">
                <div className="user-info-wrapper">
                    <div className="user-info">
                        <img src={user.avatar || '/images/avatar.png'} alt="User" className="avatar" />
                        <div>
                            <span className="username">{user.firstName}</span>
                            <span className="role">User</span>
                        </div>
                    </div>
                    <FiChevronRight className="chevron-icon" />
                </div>
                <nav className="menu">
                    <a href="/pdf/League of Logic - Guide.pdf" download>
                        <button>
                            <FiDownload /> Test Guidelines
                        </button>
                    </a>
                    <button onClick={handleDownloadInvoice}>
                        <FiDownload /> Invoice
                    </button>
                    <button>
                        <FiDownload /> Certificate
                    </button>
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
                            <img src={user.avatar || '/images/avatar.png'} alt="Profile" />
                        </div>
                        <div>
                            <span>Profile Photo</span>
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <button
                                className="change-btn"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                {uploading ? 'Uploading...' : 'Change Photo'}
                            </button>
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
                            <button className="edit-btn" onClick={() => setEditMode({ field: 'name' })}>
                                Edit
                            </button>
                        )}
                    </div>

                    <div className="field">
                        <div>
                            <span className="label">Email</span>
                            {editMode.field === 'email' ? (
                                <input
                                    type="email"
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
                            <button className="edit-btn" onClick={() => setEditMode({ field: 'email' })}>
                                Edit
                            </button>
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
