'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import axios from '@/utils/axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ConfirmDialog from '@/components/UI/ConfirmDialog/ConfirmDialog';
import '../auth.scss';

interface Step2Props {
    onNext: (data: any) => void;
    loading: boolean;
    fieldErrors: { [key: string]: string };
    clearFieldError: (fieldName: string) => void;
    initialData?: {
        firstName: string;
        lastName: string;
        dob: Date | null;
        email: string;
        password: string;
        confirmPassword: string;
        phone: string;
    };
    editingEmail?: boolean;
}

const Step1 = ({ onNext, loading, fieldErrors, clearFieldError, initialData, editingEmail = false }: Step2Props) => {
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [formData, setFormData] = useState(initialData || {
        firstName: '',
        lastName: '',
        dob: null,
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
    });

    useEffect(() => {
        if (initialData) setFormData(initialData);
    }, [initialData]);

    useEffect(() => {
        const fetchCountryCode = async () => {
            try {
                const res = await fetch("https://ipapi.co/json/");
                if (!res.ok) throw new Error("Failed to fetch country code");

                const data = await res.json();
                if (data?.country_calling_code) {
                    setFormData((prev) => ({
                        ...prev,
                        phone: `${data.country_calling_code} `,
                    }));
                }
            } catch (error) {
                console.error("Error fetching country code:", error);
            }
        };

        if (!editingEmail) fetchCountryCode();
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

        setConfirmOpen(true);
    };

    const handleConfirm = () => {
        setConfirmOpen(false);
        onNext(formData);
    };

    return (
        <>
            <form className="step-form">
                <div className="form-group">
                    <label htmlFor="firstName">Name*</label>
                    <input
                        placeholder="Enter first name"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        disabled={editingEmail}
                        className={fieldErrors.firstName ? 'error' : ''}
                    />
                    {fieldErrors.firstName && <p className="error-message">{fieldErrors.firstName}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="lastName">Last name*</label>
                    <input
                        placeholder="Enter last name"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        disabled={editingEmail}
                        className={fieldErrors.lastName ? 'error' : ''}
                    />
                    {fieldErrors.lastName && <p className="error-message">{fieldErrors.lastName}</p>}
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
                        disabled={editingEmail}
                        className={`${fieldErrors.dob ? 'error' : ''} custom-datepicker-input`}
                        calendarClassName="custom-datepicker-calendar"
                    />
                    {fieldErrors.dob && <p className="error-message">{fieldErrors.dob}</p>}
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
                    {fieldErrors.email && <p className="error-message">{fieldErrors.email}</p>}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password*</label>
                    <p>Minimum 8 characters required</p>
                    <p>Atleast 1 special character</p>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={editingEmail}
                        className={fieldErrors.password ? 'error' : ''}
                    />
                    {fieldErrors.password && <p className="error-message">{fieldErrors.password}</p>}
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
                        disabled={editingEmail}
                        className={fieldErrors.confirmPassword ? 'error' : ''}
                    />
                    {fieldErrors.confirmPassword && <p className="error-message">{fieldErrors.confirmPassword}</p>}
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
                        disabled={editingEmail}
                        className={fieldErrors.phone ? 'error' : ''}
                    />
                    {fieldErrors.phone && <p className="error-message">{fieldErrors.phone}</p>}
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
                    <button type="button" className="next-btn" onClick={handleNext} disabled={loading}>
                        {loading ? 'Registering...' : 'Next'}
                    </button>
                </div>
            </form>

            <ConfirmDialog
                open={confirmOpen}
                title="Confirm Submission"
                message="This information cannot be changed later. Are you sure you want to continue?"
                onConfirm={handleConfirm}
                onCancel={() => setConfirmOpen(false)}
            />
        </>
    );
};

export default Step1;
