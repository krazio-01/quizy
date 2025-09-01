'use client';
import { useEffect, useState, useCallback, useRef } from 'react';
import { MdCheckCircle, MdOutlineCancel } from 'react-icons/md';
import axios from '@/utils/axios';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { FiDownload } from 'react-icons/fi';
import { FiChevronRight } from 'react-icons/fi';
import { toast } from 'sonner';
import Link from 'next/link';
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
    const [uploading, setUploading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState<{ name: string; email: string }>({
        name: '',
        email: '',
    });

    const fetchAccountDetails = useCallback(async () => {
        try {
            setLoading(true);
            const { data: paymentInfoDB } = await axios.get<PaymentDetails>('/api/user/payment');

            let paymentInfoPayglocal = null;
            if (paymentInfoDB?.billing?.transactionId) {
                const response = await axios.get(`/api/payment/status`, {
                    params: { transactionId: paymentInfoDB?.billing?.transactionId },
                });
                paymentInfoPayglocal = response?.data;
            }

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
        }
    }, []);

    useEffect(() => {
        fetchAccountDetails();
    }, [fetchAccountDetails]);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0] || !paymentInfoDB) return;

        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            setUploading(true);
            const uploadRes = await axios.post('/api/upload/imgUpload', formData);
            const imgUrl = uploadRes.data.imgUrl;

            await axios.post('/api/user/updateUser', {
                email: user.email,
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
        if (paymentInfoDB?.billing?.status !== 'success') return toast.error('No payment Found');

        if (user?.country?.toUpperCase() === 'IN')
            return toast.error('Invoice generation is not available for users from India currently');

        const url = '/pdf/sampleInvoice.pdf';
        const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const firstPage = pdfDoc.getPages()[0];
        const { height } = firstPage.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

        const drawText = (text: string | number | undefined, x: number, y: number) => {
            if (!text) return;
            firstPage.drawText(String(text), {
                x,
                y,
                size: 10,
                font,
                color: rgb(0, 0, 0),
            });
        };

        const paidAmount = paymentInfoDB?.billing?.paidAmount || 0;
        const paidAmountInWords = `${paymentInfoPayglocal?.data?.Currency} ${numberToWords(paidAmount)} only`;

        const invoiceDate = new Date().toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

        const generateInvoiceNumber = () => {
            const year = new Date().getFullYear().toString().slice(-2);
            const randomPart = Math.floor(10000 + Math.random() * 90000);
            return `INTLATS/${year}/${randomPart}`;
        };

        const fields = [
            { text: generateInvoiceNumber(), x: 180, y: height - 160 },
            { text: invoiceDate, x: 180, y: height - 175 },
            { text: user?.country, x: 450, y: height - 160 },
            { text: `${user?.firstName} ${user?.lastName}`, x: 50, y: height - 215 },
            { text: `${user?.firstName} ${user?.lastName}`, x: 310, y: height - 215 },
            { text: user?.email, x: 310, y: height - 233 },
            { text: user?.email, x: 50, y: height - 233 },
            { text: user?.city, x: 50, y: height - 250 },
            { text: user?.city, x: 310, y: height - 250 },
            { text: user?.phone, x: 77, y: height - 280 },
            { text: user?.phone, x: 350, y: height - 272 },
            { text: user?.school, x: 107, y: height - 290 },
            { text: user?.school, x: 370, y: height - 282 },
            { text: paymentInfoDB?.billing?.description, x: 100, y: height - 330 },
            { text: paymentInfoDB?.billing?.qty, x: 300, y: height - 330 },
            { text: paymentInfoPayglocal?.data?.Currency, x: 350, y: height - 316 },
            { text: paymentInfoPayglocal?.data?.Currency, x: 485, y: height - 373 },
            { text: paidAmount, x: 333, y: height - 330 },
            { text: paidAmount, x: 530, y: height - 330 },
            { text: paidAmount, x: 538, y: height - 350 },
            { text: paidAmount, x: 538, y: height - 373 },
            { text: paidAmountInWords, x: 48, y: height - 382 },
            { text: paymentInfoDB?.billing?.transactionId, x: 48, y: height - 405 },
        ];

        fields.forEach(({ text, x, y }) => drawText(text, x, y));

        const pdfBytes = await pdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'invoice-ATS.pdf';
        link.click();
    };

    function numberToWords(num: number): string {
        if (num === 0) return 'zero';

        const belowTwenty = [
            '',
            'one',
            'two',
            'three',
            'four',
            'five',
            'six',
            'seven',
            'eight',
            'nine',
            'ten',
            'eleven',
            'twelve',
            'thirteen',
            'fourteen',
            'fifteen',
            'sixteen',
            'seventeen',
            'eighteen',
            'nineteen',
        ];
        const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
        const thousands = ['', 'thousand', 'million', 'billion'];

        const helper = (n: number): string => {
            if (n === 0) return '';
            if (n < 20) return belowTwenty[n] + ' ';
            if (n < 100) return tens[Math.floor(n / 10)] + ' ' + helper(n % 10);
            if (n < 1000) return belowTwenty[Math.floor(n / 100)] + ' hundred ' + helper(n % 100);
            return '';
        };

        let i = 0;
        let words = '';
        while (num > 0) {
            if (num % 1000 !== 0) {
                words = helper(num % 1000) + thousands[i] + ' ' + words;
            }
            num = Math.floor(num / 1000);
            i++;
        }

        return words.trim();
    }

    const handlePayment = async () => {
        try {
            setPaymentLoading(true);

            const paymentData = {
                customerEmail: user?.email,
                customerPhone: user?.phone,
                metadata: {
                    registrationData: formData,
                },
            };

            const { data } = await axios.post('/api/payment/initiate', paymentData);

            if (data.success) window.location.href = data.paymentUrl;
            else toast.error(data.message || 'Payment initiation failed');
        } catch (error) {
            console.error('Payment error: ', error);
        } finally {
            setPaymentLoading(false);
        }
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
                    <a href="/pdf/guideline.pdf" download>
                        <button>
                            <FiDownload /> Test Guidelines
                        </button>
                    </a>
                    <a href="/pdf/CT Practice questions.pdf" download>
                        <button>
                            <FiDownload /> Sample Questions
                        </button>
                    </a>
                    <button onClick={handleDownloadInvoice}>
                        <FiDownload /> Invoice
                    </button>
                    <button>
                        <FiDownload /> Certificate
                    </button>
                </nav>

                <div className="links-container">
                    <Link href="/quiz/contest/info">FAQs</Link>
                </div>
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
                            <span className="value">{formData.name}</span>
                        </div>
                    </div>

                    <div className="field">
                        <div>
                            <span className="label">Email</span>
                            <span className="value">{user?.email}</span>
                        </div>
                    </div>

                    <div className="field">
                        <div>
                            <span className="label">DOB</span>
                            <span className="value">
                                {user?.dob
                                    ? new Date(user.dob).toLocaleDateString('en-GB', {
                                          day: '2-digit',
                                          month: '2-digit',
                                          year: 'numeric',
                                      })
                                    : ''}
                            </span>
                        </div>
                    </div>

                    <div className="field">
                        <div>
                            <span className="label">Grade</span>
                            <span className="value">
                                {user?.grade
                                    ? user.grade.charAt(0).toUpperCase() + user.grade.slice(1).replace(/(\d+)/, ' $1')
                                    : ''}
                            </span>
                        </div>
                    </div>

                    <div className="billing">
                        <h4>Billing</h4>

                        {paymentInfoDB?.billing?.status !== 'success' ? (
                            <div className="billing__empty">No billing information available.</div>
                        ) : (
                            <div className="billing__card">
                                <div className="billing__header">
                                    <span>Description</span>
                                    <span>HSN/SAC</span>
                                    <span>Qty</span>
                                    <span>Rate ({paymentInfoPayglocal?.data?.Currency})</span>
                                    <span>IGST</span>
                                    <span>Amount</span>
                                </div>

                                <div className="billing__row">
                                    <span>{paymentInfoDB?.billing?.description}</span>
                                    <span>{paymentInfoDB?.billing?.hsnSac}</span>
                                    <span>{paymentInfoDB?.billing?.qty}</span>
                                    <span>{paymentInfoDB?.billing?.rate}</span>
                                    <span>
                                        {paymentInfoDB?.billing?.igst} ({paymentInfoDB?.billing?.igstAmount})
                                    </span>
                                    <span>{paymentInfoDB?.billing?.paidAmount}</span>
                                </div>
                            </div>
                        )}

                        <div className="bottom-wrapper">
                            {paymentInfoDB?.billing && (
                                <>
                                    <div
                                        className={`status ${
                                            paymentInfoDB.billing.status === 'success' ? 'paid' : 'failed'
                                        }`}
                                    >
                                        Fees Status{' '}
                                        <span>
                                            {paymentInfoDB.billing.status === 'success' ? (
                                                <MdCheckCircle />
                                            ) : (
                                                <MdOutlineCancel />
                                            )}
                                        </span>
                                    </div>

                                    {paymentInfoDB.billing.status !== 'success' && (
                                        <div className="pay-now-container">
                                            <button disabled={paymentLoading} onClick={handlePayment}>
                                                Pay Now
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProfilePage;
