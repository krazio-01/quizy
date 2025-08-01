'use client';
import React, { useState } from 'react';
import { toast } from 'sonner';
import axios from 'axios';
import DefaultAvatar from '../../../../public/images/default1.webp';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import '../auth.scss';

const Page = () => {
    const [loading, setLoading] = useState(false);
    const [resendOtpLoading, setResendOtpLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        schoolDetails: {
            country: '',
            city: '',
            school: '',
            grade: '',
        },
        personalDetails: {
            firstName: '',
            lastName: '',
            dob: '',
            email: '',
            password: '',
            confirmPassword: '',
            phone: '',
        },
        otp: '',
    });

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const handleRegistration = async (personalData: any) => {
        try {
            setLoading(true);

            await axios.post('/api/auth/signup', personalData);

            additionalToast();
            return true;
        } catch (error: any) {
            console.error('Registration error:', error);
            toast.error(error.response?.data?.message || 'Registration failed');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerification = async (otp: string) => {
        try {
            setLoading(true);
            const { personalDetails } = formData;

            await axios.post('/api/auth/verifyOtp', {
                email: personalDetails.email,
                otp,
            });

            toast.success('Your account is verified!');
            return true;
        } catch (error: any) {
            console.error('OTP verification error:', error);
            toast.error(error.response?.data?.message || 'Invalid OTP');
            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResendOtpLoading(true);
        try {
            await axios.post('/api/auth/resendOtp', { email: formData.personalDetails.email });
            toast.success('A new OTP has been sent to your email.');
        } catch (err: any) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setResendOtpLoading(false);
        }
    };

    const handleUserUpdate = async (schoolDetails: any) => {
        try {
            setLoading(true);

            await axios.post('/api/auth/updateUser', { ...formData.personalDetails, ...schoolDetails });
            toast.success('Profile updated successfully!');
        } catch (error: any) {
            console.error('User update error:', error);
            toast.error(error.response?.data?.message || 'User update failed');
        } finally {
            setLoading(false);
        }
    };

    const additionalToast = () => {
        toast('An Otp has been sent to your email.', {
            duration: Infinity,
            closeButton: true,
        });
    };

    return (
        <div className="auth-container">
            <div className="progress-wrapper">
                {[1, 2, 3].map((s, index) => (
                    <div key={s} className="progress-step">
                        <div className={`circle ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}>{s}</div>
                        {index !== 2 && <div className={`line ${step > s ? 'completed' : ''}`} />}
                    </div>
                ))}
            </div>

            {step === 1 && (
                <Step1
                    onNext={async (data) => {
                        setFormData((prev) => ({ ...prev, personalDetails: data }));
                        const success = await handleRegistration(data);
                        if (success) nextStep();
                    }}
                    onBack={prevStep}
                    loading={loading}
                />
            )}

            {step === 2 && (
                <Step2
                    onBack={prevStep}
                    onVerify={async (otp) => {
                        setFormData((prev) => ({ ...prev, otp }));
                        const success = await handleOtpVerification(otp);
                        if (success) nextStep();
                    }}
                    onResendOtp={handleResend}
                    loading={loading}
                    resendOtpLoading={resendOtpLoading}
                />
            )}

            {step === 3 && (
                <Step3
                    onNext={(data) => {
                        setFormData((prev) => ({ ...prev, schoolDetails: data }));
                        handleUserUpdate(data);
                    }}
                    loading={loading}
                />
            )}
        </div>
    );
};

export default Page;
