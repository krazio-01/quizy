import React from 'react';
import Link from 'next/link';
import '../../auth.scss';

const Page = () => {
    return (
        <div className="forgot-password-container">
            <div className="forgot-password-card">
                <h2 style={{ color: '#ab2024' }}>Forgot Your Password?</h2>
                <p className="subtitle">Don&apos;t worry we&apos;ll help you.</p>

                <p className="info-text">
                    A reset link has been sent to your email. Go back to login to continue.
                </p>

                <Link href="/login">
                    Login
                </Link>
            </div>
        </div>
    );
};

export default Page;
