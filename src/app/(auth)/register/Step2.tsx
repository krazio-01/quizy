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
    otpToastId: string | number | undefined;
}

const Step2 = ({ onBack, onVerify, onResendOtp, loading, resendOtpLoading, otpToastId }: Step2Props) => {
    const [otpValues, setOtpValues] = useState(Array(6).fill(''));
    const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        return () => {
            if (otpToastId !== undefined) {
                toast.dismiss(otpToastId);
                otpToastId = undefined;
            }
        };
    }, []);

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

    return (
        <div className="step-form otp-form">
            <h3>One time password</h3>
            <p className="otp-subtext">Check your spam, trash/junk folders if not in inbox.</p>

            <div className="otp-box">
                {otpValues.map((value, i) => (
                    <input
                        key={i}
                        ref={(el) => {
                            otpRefs.current[i] = el;
                        }}
                        type="text"
                        maxLength={1}
                        className="otp-input"
                        value={value}
                        onChange={(e) => handleChange(i, e)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                    />
                ))}
            </div>

            <button className="next-btn" onClick={handleVerify} disabled={loading}>
                {loading ? 'Verifying...' : 'Verify'}
            </button>
            <button className="resend" onClick={handleResendOtp} disabled={resendOtpLoading}>
                {resendOtpLoading ? 'Resending...' : 'Resend OTP'}
            </button>
        </div>
    );
};

export default Step2;
