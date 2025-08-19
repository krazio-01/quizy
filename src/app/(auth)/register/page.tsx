'use client';
import React, { useEffect, useState } from 'react';
import useAppStore from '@/store/store';
import { toast } from 'sonner';
import axios from 'axios';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import '../auth.scss';

const Page = () => {
    const step = useAppStore((state) => state.step);
    const setStep = useAppStore((state) => state.setStep);

    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [resendOtpLoading, setResendOtpLoading] = useState(false);
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
    const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const stepParam = params.get('step');
        if (stepParam === '3') setStep(3);
    }, [setStep]);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const clearFieldError = (fieldName: string) => {
        setFieldErrors((prev) => ({ ...prev, [fieldName]: '' }));
    };

    const handleRegistration = async (personalData: any) => {
        try {
            setLoading(true);
            setFieldErrors({});

            await axios.post('/api/auth/signup', personalData);
            setOtpSent(true);
            localStorage.setItem('userEmail', personalData.email);
            localStorage.setItem('phone', personalData.phone);
            nextStep();
        } catch (error: any) {
            const { message = '', fields = [] } = error.response?.data || {};
            const newErrors: { [key: string]: string } = {};

            fields.forEach((field: string) => {
                newErrors[field] = 'This field is required';
            });

            if (!fields.length) {
                if (message.includes('Passwords do not match')) {
                    newErrors['password'] = message;
                    newErrors['confirmPassword'] = message;
                }
                if (message.includes('Invalid email format')) newErrors['email'] = message;
                if (message.includes('Password must be at least')) newErrors['password'] = message;
                if (message.includes('already registered')) newErrors['email'] = message;
                if (message.includes('Date of birth must be in the past')) newErrors['dob'] = message;
                if (message.includes('Age must be between')) newErrors['dob'] = message;
                if (message.includes('Invalid phone number')) newErrors['phone'] = message;
            }

            setFieldErrors(newErrors);
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerification = async (otp: string) => {
        try {
            setLoading(true);
            setFieldErrors({});
            const { personalDetails } = formData;

            await axios.post('/api/auth/verifyOtp', {
                email: personalDetails.email,
                otp,
            });

            toast.success('Your account is verified!');
            nextStep();
        } catch (error: any) {
            setFieldErrors({ otp: error.response?.data?.message || 'Invalid OTP' });
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
            setFieldErrors({});
            const email = localStorage.getItem('userEmail');

            const response = await axios.post('/api/user/updateUser', { email, ...schoolDetails });
            toast.success('Profile updated successfully!');

            if (response.status === 200) await handlePayment();

            // localStorage.removeItem('userEmail');
            // localStorage.removeItem('phone');
        } catch (error: any) {
            const field = error.response?.data?.field;
            const message = error.response?.data?.message || 'User update failed';

            if (field) {
                setFieldErrors((prev: any) => ({
                    ...prev,
                    [field]: message,
                }));
            } else toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        try {
            const email = localStorage.getItem('userEmail');
            const phone = localStorage.getItem('phone');

            const paymentData = {
                customerEmail: email,
                customerPhone: phone,
                metadata: {
                    registrationData: formData,
                    step: 'step3_completed',
                },
            };

            const { data } = await axios.post('/api/payment/initiate', paymentData);

            if (data.success) window.location.href = data.paymentUrl;
            else toast.error(data.message || 'Payment initiation failed');
        } catch (error) {
            console.error('Payment error: ', error);
        }
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
                        await handleRegistration(data);
                    }}
                    onBack={prevStep}
                    loading={loading}
                    fieldErrors={fieldErrors}
                    clearFieldError={clearFieldError}
                />
            )}

            {step === 2 && (
                <Step2
                    onBack={prevStep}
                    onVerify={async (otp) => {
                        setFormData((prev) => ({ ...prev, otp }));
                        await handleOtpVerification(otp);
                    }}
                    onResendOtp={handleResend}
                    loading={loading}
                    resendOtpLoading={resendOtpLoading}
                    email={formData.personalDetails.email}
                    otpSent={otpSent}
                    fieldErrors={fieldErrors}
                />
            )}

            {step === 3 && (
                <Step3
                    onNext={(data) => {
                        setFormData((prev) => ({ ...prev, schoolDetails: data }));
                        handleUserUpdate(data);
                    }}
                    loading={loading}
                    fieldErrors={fieldErrors}
                />
            )}
        </div>
    );
};

export default Page;
