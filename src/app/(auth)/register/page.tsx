'use client';
import React, { useState } from 'react';
import useAppStore from '@/store/store';
import { toast } from 'sonner';
import axios from '@/utils/axios';
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
    const [userId, setUserId] = useState(null);
    const [formData, setFormData] = useState({
        schoolDetails: {
            country: '',
            city: '',
            school: '',
            grade: '',
            couponCode: '',
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
    const [isRegistrationComplete, setIsRegistrationComplete] = useState(false);

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const clearFieldError = (fieldName: string) => {
        setFieldErrors((prev) => ({ ...prev, [fieldName]: '' }));
    };

    const handleRegistration = async (personalData: any) => {
        try {
            setLoading(true);
            setFieldErrors({});

            function formatDateOnlyLocal(date) {
                if (!date) return '';
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                return `${year}-${month}-${day}`;
            }

            await axios.post('/api/auth/signup', {
                ...personalData,
                dob: personalData.dob instanceof Date
                    ? formatDateOnlyLocal(personalData.dob)
                    : personalData.dob,
                userId,
            });
            toast.success('Details submitted successfully.');
            setOtpSent(true);
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
                if (message.includes('Password must be')) newErrors['password'] = message;
                if (message.includes('already registered')) newErrors['email'] = message;
                if (message.includes('Date of birth must be in the past')) newErrors['dob'] = message;
                if (message.includes('Invalid date format')) newErrors['dob'] = message;
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

            await axios.post('/api/auth/verifyOtp', { otp });

            toast.success('Your account is verified!');
            localStorage.removeItem('app-storage');
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
            await axios.post('/api/auth/resendOtp');
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

            let response = null
            if (!isRegistrationComplete) {
                response = await axios.post('/api/user/completeRegistration', { ...schoolDetails });
                toast.success('Profile updated successfully!');
                localStorage.removeItem('app-storage');
            }

            if (response?.status === 200 || isRegistrationComplete) {
                console.log('md-inside if of handleUserUpdate');
                setIsRegistrationComplete(true);
                await handlePayment(schoolDetails.couponCode);
            }
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

    const handlePayment = async (couponCode?: string) => {
        console.log('md-inside handlePayment');
        try {
            const { data } = await axios.post('/api/payment/initiate', { couponCode });

            if (data.success) {
                const allowedOrigins = ['https://api.uat.payglocal.in', 'https://api.payglocal.com'];

                const urlObj = new URL(data.paymentUrl);
                if (!allowedOrigins.includes(urlObj.origin) || !urlObj.pathname.startsWith('/gl/')) {
                    toast.error('Invalid payment URL');
                    return;
                }

                window.location.href = data.paymentUrl;
            }
            else toast.error(data.message || 'Payment initiation failed');
        } catch (error) {
            const field = error.response?.data?.field;
            const message = error.response?.data?.message || 'Payment initiation failed';

            if (field) {
                setFieldErrors((prev: any) => ({
                    ...prev,
                    [field]: message,
                }));
            } else toast.error(message);
        }
    };

    const getUserInfo = async () => {
        try {
            const response = await axios.get('/api/user/details');

            if (response.status === 200) {
                setUserId(response?.data._id);
                setFormData((prev) => ({
                    ...prev,
                    personalDetails: {
                        ...prev.personalDetails,
                        firstName: response?.data.firstName || '',
                        lastName: response?.data.lastName || '',
                        dob: response?.data.dob || '',
                        email: response?.data.email || '',
                        password: '*********',
                        confirmPassword: '*********',
                        phone: response?.data.phone || '',
                    },
                }));
            } else {
                toast.error(response?.data.message || 'Could not fetch user details');
            }
        } catch (error: any) {
            console.error('User info error: ', error);
            toast.error(error.response?.data?.message || 'Failed to fetch user details');
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
                    loading={loading}
                    fieldErrors={fieldErrors}
                    clearFieldError={clearFieldError}
                    initialData={{
                        ...formData.personalDetails,
                        dob: formData.personalDetails.dob ? new Date(formData.personalDetails.dob) : null,
                    }}
                    editingEmail={otpSent && !!formData.personalDetails.email}
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
                    email={
                        formData.personalDetails.email
                            ? formData.personalDetails.email
                            : sessionStorage.getItem('email')
                    }
                    otpSent={otpSent}
                    setOtpSent={setOtpSent}
                    fieldErrors={fieldErrors}
                    getUserInfo={getUserInfo}
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
                    isRegistrationComplete={isRegistrationComplete}
                />
            )}
        </div>
    );
};

export default Page;
