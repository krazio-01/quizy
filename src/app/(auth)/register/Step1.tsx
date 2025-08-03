'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../auth.scss';

interface Step2Props {
    onNext: (data: any) => void;
    onBack: () => void;
    loading: boolean;
    fieldErrors: { [key: string]: boolean };
    clearFieldError: (fieldName: string) => void;
}

const Step1 = ({ onNext, onBack, loading, fieldErrors, clearFieldError }: Step2Props) => {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [formData, setFormData] = useState<{
        firstName: string;
        lastName: string;
        dob: Date | null;
        email: string;
        password: string;
        confirmPassword: string;
        phone: string;
    }>({
        firstName: '',
        lastName: '',
        dob: null,
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });

    useEffect(() => {
        const fetchCountryCode = async () => {
            try {
                const { data } = await axios.get('https://ipapi.co/json/');
                if (data?.country_calling_code) {
                    setFormData(prev => ({
                        ...prev,
                        phone: `${data.country_calling_code} `
                    }));
                }
            } catch (error) {
                console.error('Error fetching country code:', error);
            }
        };

        fetchCountryCode();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNext = () => {
        if (!termsAccepted) {
            toast.error('Please accept the terms.');
            return;
        }
        onNext(formData);
    };

    return (
        <form className="step-form">
            <div className="form-group">
                <label htmlFor="firstName">Name*</label>
                <input
                    placeholder="John"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className={fieldErrors.firstName ? 'error' : ''}
                />
            </div>

            <div className="form-group">
                <label htmlFor="lastName">Last name*</label>
                <input
                    placeholder="Smith"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className={fieldErrors.lastName ? 'error' : ''}
                />
            </div>

            <div className="form-group">
                <label htmlFor="dob">Date of birth*</label>
                <DatePicker
                    placeholderText="Choose your date of birth"
                    selected={formData.dob}
                    onChange={(date: Date | null) => {
                        if (date) setFormData({ ...formData, dob: date });
                    }}
                    id="dob"
                    name="dob"
                    dateFormat="yyyy-MM-dd"
                    required
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                    className={fieldErrors.dob ? 'error' : ''}
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">Email ID*</label>
                <span>
                    Please enter correct email address as this will be used for all future communications regarding the
                    test.
                </span>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={fieldErrors.email ? 'error' : ''}
                />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password*</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={fieldErrors.password ? 'error' : ''}
                />
            </div>

            <div className="form-group">
                <label htmlFor="confirmPassword">Confirm password*</label>
                <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={fieldErrors.confirmPassword ? 'error' : ''}
                />
            </div>

            <div className="form-group">
                <label htmlFor="phone">Phone number, with country code*</label>
                <input
                    placeholder="For eg. +44 7896543201"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className={fieldErrors.phone ? 'error' : ''}
                />
            </div>

            <p className="auth-form-footer">
                <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                <label htmlFor="terms">
                    I acknowledge and accept{' '}
                    <Link className="tAndc" href="terms-and-conditions">
                        all terms and conditions
                    </Link>
                </label>
            </p>

            <div className="form-buttons">
                {/* <button type="button" className="back-btn" onClick={onBack}>
                    Back
                </button> */}
                <button type="button" className="next-btn" onClick={handleNext} disabled={loading}>
                    {loading ? 'Registering...' : 'Next'}
                </button>
            </div>
        </form>
    );
};

export default Step1;
