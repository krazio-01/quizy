'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/utils/axios';
import { toast } from 'sonner';
import '../../auth.scss';

const Page = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            toast.error('Please enter your email.');
            return;
        }

        try {
            setLoading(true);
            const { data } = await axios.post('/api/auth/forgot-password/request', { email });
            toast.success(data.message);
            setEmail('');
            router.replace('/forgot-password/success');
        } catch (error: any) {
            toast.error(error.response?.data?.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <h2>Forgot Your Password?</h2>
                <p className="subtitle">Don&apos;t worry we&apos;ll help you.</p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Enter your email address</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="User@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? 'Sending...' : 'Send'}
                    </button>
                </form>

                <p className="footer-text">We&apos;ll send a link to reset your password after you enter your email.</p>
            </div>
        </div>
    );
};

export default Page;
