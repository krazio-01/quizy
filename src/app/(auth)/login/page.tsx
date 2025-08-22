'use client';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import '../auth.scss';

const LoginPage = () => {
    const emailRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string; general?: string }>({});
    const passwordRef = useRef<HTMLInputElement>(null);

    const router = useRouter();

    const handleLogin = async () => {
        setLoading(true);
        setFieldErrors({});

        const result = await signIn('credentials', {
            redirect: false,
            identifier: emailRef.current?.value,
            password: passwordRef.current?.value,
        });

        if (result?.error) {
            try {
                const parsedError = JSON.parse(result.error);

                if (!parsedError.field) {
                    if (parsedError.message === 'Please Complete Your Profile To Log In.') {
                        localStorage.setItem('userEmail', parsedError?.email);
                        localStorage.setItem('phone', parsedError?.phone);
                        router.push('/register?step=3');
                    }
                    toast.error(parsedError.message);
                    return;
                }

                setFieldErrors((prev) => {
                    const updatedErrors = { ...prev };
                    if (Array.isArray(parsedError.field)) {
                        parsedError.field.forEach((f: string) => {
                            updatedErrors[f] = parsedError.message;
                        });
                    } else updatedErrors[parsedError.field] = parsedError.message;

                    return updatedErrors;
                });
            } catch {
                toast.error(result.error);
            }
        } else if (result?.url) {
            if (localStorage.getItem('userEmail') && localStorage.getItem('phone')) {
                localStorage.removeItem('userEmail');
                localStorage.removeItem('phone');
            }
            toast.success('Login successful');
            router.push('/');
        }
        setLoading(false);
    };

    return (
        <div className="auth-container">
            <div className="login-box">
                <h1 className="login-title">Welcome Back!</h1>
                <p className="login-subtitle">Log in to continue your learning journey.</p>

                <div className="login-form">
                    <div className="input-container">
                        <label htmlFor="email">Email*</label>
                        <input
                            id="email"
                            className={`${fieldErrors.email ? 'error' : ''}`}
                            type="email"
                            placeholder="User@email.com"
                            ref={emailRef}
                            required
                        />
                        {fieldErrors.email && <p className="error-message">{fieldErrors.email}</p>}
                    </div>

                    <div className="input-container">
                        <label htmlFor="password">Password*</label>
                        <input
                            id="password"
                            className={`${fieldErrors.password ? 'error' : ''}`}
                            type="password"
                            placeholder="********************"
                            ref={passwordRef}
                            required
                        />
                        {fieldErrors.password && <p className="error-message">{fieldErrors.password}</p>}
                    </div>

                    <p className="forgot-password">
                        <Link href="/forgot-password/request">Forgot your password? Reset it here</Link>
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
