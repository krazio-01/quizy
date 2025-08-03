'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import '../auth.scss';

const LoginPage = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        const result = await signIn('credentials', {
            redirect: false,
            identifier: emailRef.current?.value,
            password: passwordRef.current?.value,
        });

        if (result?.error) {
            if (result.error === "Please Complete Your Profile To Log In.")
                router.push('/register?step=3');
            toast.error(result.error);
        } else if (result?.url) {
            toast.success('Login successful');
            router.push('/');
            setLoading(false);
        };
    }

    return (
        <div className="auth-container">
            <div className="login-box">
                <h1 className="login-title">Welcome Back!</h1>
                <p className="login-subtitle">Log in to continue your learning journey.</p>

                <div className="login-form">
                    <div className="input-container">
                        <label htmlFor="email">Email*</label>
                        <input id="email" type="email" placeholder="User@email.com" ref={emailRef} required />
                    </div>

                    <div className="input-container">
                        <label htmlFor="password">Password*</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="********************"
                            ref={passwordRef}
                            required
                        />
                    </div>

                    <p className="forgot-password">
                        <Link href="/forgot-password">Forgot your password? Reset it here</Link>
                    </p>

                    <button className="login-button" onClick={handleLogin} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <p className="signup-message">
                        Don&apos;t have an account? <Link href="/register">{'[Sign up now]'}</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
