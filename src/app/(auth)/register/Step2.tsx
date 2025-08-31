'use client';
import React, { useRef, useState, useEffect } from 'react';
import { toast } from 'sonner';
import '../auth.scss';

export interface Step2Props {
    onBack: () => void;
    onVerify: (otp: string) => void;
    onResendOtp: () => void;
    loading: boolean;
    resendOtpLoading: boolean;
    otpSent: boolean;
    email: string;
    fieldErrors: { [key: string]: string };
    getUserInfo: () => void;
}

const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    if (!name || !domain) return email;

    const [domainName, domainExt] = domain.split('.');
    if (!domainName || !domainExt) return email;

    const firstTwo = name.slice(0, 2);
    const lastTwoDomain = domainName.slice(-2);

    const maskedMiddle = '*'.repeat(name.length - 2 + domainName.length - 2);

    return `${firstTwo}${maskedMiddle}${lastTwoDomain}.${domainExt}`;
};

const Step2 = ({
    onBack,
    onVerify,
    onResendOtp,
    loading,
    resendOtpLoading,
    otpSent,
    email,
    fieldErrors,
    getUserInfo,
}: Step2Props) => {
    const [otpValues, setOtpValues] = useState(Array(6).fill(''));
    const [changeEmailLoading, setChangeEmailLoading] = useState(false);

    const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        if (!otpSent) return;

        const toastId = toast('An OTP has been sent to your email.', {
            duration: Infinity,
            closeButton: true,
        });

        return () => {
            toast.dismiss(toastId);
        };
    }, [otpSent]);

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!/^[0-9]?$/.test(value)) return;

        const newOtpValues = [...otpValues];
        newOtpValues[index] = value;
        setOtpValues(newOtpValues);

        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = () => {
        const otp = otpValues.join('');
        if (otp.length === 6) {
            onVerify(otp);
        }
    };

    const handleResendOtp = () => {
        setOtpValues(Array(6).fill(''));
        otpRefs.current[0]?.focus();
        onResendOtp();
    };

    const handleChangeEmail = async () => {
        try {
            setChangeEmailLoading(true);
            await getUserInfo();
            onBack();
        } catch (error) {
            console.error('Change email failed:', error);
            toast.error('Failed to fetch user info. Please try again.');
        } finally {
            setChangeEmailLoading(false);
        }
    };

    return (
        <div className="step-form otp-form">
            <h3>One time password</h3>
            <p className="otp-subtext">
                Sent on <strong>{maskEmail(email)}</strong>. Check your spam, trash/junk folders if not received in
                inbox.
            </p>

            <div className="otp-input-wrapper">
                <div className="otp-box">
                    {otpValues.map((value, i) => (
                        <input
                            key={i}
                            ref={(el) => {
                                otpRefs.current[i] = el;
                            }}
                            type="text"
                            maxLength={1}
                            className={`otp-input ${fieldErrors.otp ? 'error' : ''}`}
                            value={value}
                            onChange={(e) => handleChange(i, e)}
                            onKeyDown={(e) => handleKeyDown(i, e)}
                        />
                    ))}
                </div>
                {fieldErrors.otp && <p className="error-message">{fieldErrors.otp}</p>}
            </div>

            <button className="next-btn" onClick={handleVerify} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify'}
            </button>
            <div className="bottom-action-wrapper">
                <button className="resend" onClick={handleResendOtp} disabled={resendOtpLoading}>
                    {resendOtpLoading ? 'Resending...' : 'Resend OTP'}
                </button>
                <span>
                    Not sure email is correct?
                    <button className="change-email" onClick={handleChangeEmail} disabled={changeEmailLoading}>
                        {changeEmailLoading ? 'Please wait...' : 'Change email'}
                    </button>
                </span>
            </div>
        </div>
    );
};

export default Step2;
