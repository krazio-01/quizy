'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { MdCheckCircle, MdOutlineCancel } from 'react-icons/md';
import axios from 'axios';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { FiDownload } from 'react-icons/fi';
import { FiChevronRight } from 'react-icons/fi';
import { toast } from 'sonner';
import './profile.scss';

interface PaymentDetails {
    billing: {
        transactionId: string;
        description: string;
        hsnSac: string;
        qty: number;
        rate: number;
        igst: string;
        igstAmount: number;
        paidAmount: number;
        status: string;
    };
}

const ProfilePage = () => {
    const [paymentInfoDB, setPaymentInfoDB] = useState<PaymentDetails | null>(null);
    const [paymentInfoPayglocal, setPaymentInfoPayglocal] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [uploading, setUploading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [editMode, setEditMode] = useState<{ field: string | null }>({ field: null });
    const [formData, setFormData] = useState<{ name: string; email: string }>({
        name: '',
        email: '',
    });

    const fetchAccountDetails = useCallback(async () => {
        try {
            setLoading(true);
            const { data: paymentInfoDB } = await axios.get<PaymentDetails>('/api/user/payment');

            const { data: paymentInfoPayglocal } = await axios.get(`/api/payment/status`, {
                params: { transactionId: paymentInfoDB.billing.transactionId },
            });

            const { data: user } = await axios.get('/api/user/details');

            setPaymentInfoDB(paymentInfoDB);
            setPaymentInfoPayglocal(paymentInfoPayglocal);
            setUser(user);
            setFormData({
                name: `${user?.firstName} ${user?.lastName}`.trim(),
                email: user?.email,
            });
        } catch (err) {
            toast.error('Failed to fetch user details');
        } finally {
            setLoading(false);
            console.log('md-paymentInfoPayglocal: ', paymentInfoPayglocal);
        }
    }, []);

    useEffect(() => {
        fetchAccountDetails();
    }, [fetchAccountDetails]);

    const handleSave = async () => {
        if (!paymentInfoDB) return;
        try {
            setUpdating(true);

            const [firstName, ...rest] = formData.name.trim().split(' ');
            const lastName = rest.join(' ');

            const res = await axios.post('/api/user/update', {
                userId: user?._id,
                firstName,
                lastName,
                email: formData.email,
            });

            if (res.status === 200) {
                toast.success('Profile updated successfully');
                await fetchAccountDetails();
                setEditMode({ field: null });
            }
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setUpdating(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0] || !paymentInfoDB) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            const uploadRes = await axios.post('/api/upload/imgUpload', formData);
            const imgUrl = uploadRes.data.imgUrl;

            await axios.post('/api/user/update', {
                userId: user?._id,
                avatar: imgUrl,
            });

            toast.success('Profile photo updated');
            await fetchAccountDetails();
        } catch {
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleDownloadInvoice = async () => {
        const url = '/pdf/sampleInvoice.pdf';
        const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const { height } = firstPage.getSize();

        const font = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

        // === Fill in fields ===
        firstPage.drawText('INTLATS/24/00045', {
            x: 180,
            y: height - 160,
            size: 10,
            font,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(`${Date.now()}`, {
            x: 180,
            y: height - 175,
            size: 10,
            font,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(`${user?.firstName + ' ' + user?.lastName}`, {
            x: 55,
            y: height - 260,
            size: 10,
            font,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(`${paymentInfoDB.billing.paidAmount}`, {
            x: 485,
            y: height - 385,
            size: 10,
            font,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText('UAE Dirham Five Hundred only', {
            x: 48,
            y: height - 382,
            size: 10,
            font,
            color: rgb(0, 0, 0),
        });

        firstPage.drawText(`${paymentInfoDB.billing.transactionId}`, {
            x: 48,
            y: height - 405,
            size: 10,
            font,
            color: rgb(0, 0, 0),
        });

        const pdfBytes = await pdfDoc.save();

        // === Trigger download ===
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'invoice-ATS.pdf';
        link.click();
    };

    if (loading) return <div className="profile-page loading">Loading...</div>;
    if (!paymentInfoDB) return <div className="profile-page error">No user data available</div>;

    return (
        <div className="profile-page">
            <aside className="sidebar">
                <div className="user-info-wrapper">
                    <div className="user-info">
                        <img src={user?.avatar || '/images/avatar.png'} alt="User" className="avatar" />
                        <div>
                            <span className="username">{user?.firstName}</span>
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
                    <button onClick={() => { }}>
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
                        Welcome, <span>{user?.firstName}</span>
                    </h2>
                </header>

                <section className="profile-section">
                    <h3>Your Profile</h3>

                    <div className="profile-photo">
                        <div>
                            <span>Profile Photo</span>
                            <img src={user?.avatar || '/images/avatar.png'} alt="Profile" />
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
                            <button
                                style={{ display: 'none' }}
                                className="edit-btn"
                                onClick={() => setEditMode({ field: 'name' })}
                            >
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
                                <span className="value">{user?.email}</span>
                            )}
                        </div>
                        {editMode.field === 'email' ? (
                            <button className="edit-btn" onClick={handleSave} disabled={updating}>
                                {updating ? 'Saving...' : 'Save'}
                            </button>
                        ) : (
                            <button
                                style={{ display: 'none' }}
                                className="edit-btn"
                                onClick={() => setEditMode({ field: 'email' })}
                            >
                                Edit
                            </button>
                        )}
                    </div>

                    <div className="billing">
                        <h4>Billing</h4>

                        {!paymentInfoDB.billing ? (
                            <div className="billing__empty">No billing information available.</div>
                        ) : (
                            <div className="billing__card">
                                <div className="billing__header">
                                    <span>Description</span>
                                    <span>HSN/SAC</span>
                                    <span>Qty</span>
                                    <span>Rate ({paymentInfoPayglocal.data.Currency})</span>
                                    <span>IGST</span>
                                    <span>Amount</span>
                                </div>

                                <div className="billing__row">
                                    <span>{paymentInfoDB.billing.description}</span>
                                    <span>{paymentInfoDB.billing.hsnSac}</span>
                                    <span>{paymentInfoDB.billing.qty}</span>
                                    <span>{paymentInfoDB.billing.rate}</span>
                                    <span>
                                        {paymentInfoDB.billing.igst} ({paymentInfoDB.billing.igstAmount})
                                    </span>
                                    <span>{paymentInfoDB.billing.paidAmount}</span>
                                </div>
                            </div>
                        )}

                        {paymentInfoDB.billing && (
                            <div className={`status ${paymentInfoDB.billing.status === 'success' ? 'paid' : 'failed'}`}>
                                Fees Status{' '}
                                <span>
                                    {paymentInfoDB.billing.status === 'success' ? (
                                        <MdCheckCircle />
                                    ) : (
                                        <MdOutlineCancel />
                                    )}
                                </span>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProfilePage;
