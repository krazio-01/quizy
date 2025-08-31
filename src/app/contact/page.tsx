'use client';
import React, { useState, useCallback } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import { toast } from 'sonner';
import './contact.scss';

const contactData = [
    {
        country: "India",
        address:
            "The First Building, Corporate House A2, 1st Floor, Nyay Marg, Vastrapur, Ahmedabad",
        phone: "+97144396233 / +13323318436",
        email: "competition@ei.study",
    },
    {
        country: "India",
        address:
            "The CUBE - Karle Town Center, 100 Ft, Nagavara, Bengaluru",
        phone: "+97144396233 / +13323318436",
        email: "competition@ei.study",
    },
    {
        country: "South Africa",
        address:
            "2 Ncondo Place, Ridgeside Umhlanga Ridge, Durban 4320, South Africa",
        phone: "+97144396233 / +13323318436",
        email: "competition@ei.study",
    },
    {
        country: "UAE",
        address:
            "Sage Educational Consultants, Office 110, 1st floor, Building 6, Dubai Outsource City",
        phone: "+97144396233 / +13323318436",
        email: "competition@ei.study",
    },
    {
        country: "USA",
        address: "3819 N 3rd St., Ste E-104, Phoenix, Arizona - 85012",
        phone: "+97144396233 / +13323318436",
        email: "competition@ei.study",
    },
    {
        country: "Kingdom of Saudi Arabia",
        address:
            "Office 225, Business Plaza, East Tower, Sharifiyah district, Madinah Road Jeddah",
        phone: "+97144396233 / +13323318436",
        email: "competition@ei.study",
    },
];

const initialFormState = {
    firstName: '',
    lastName: '',
    email: '',
    message: '',
};

const Page = () => {
    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            const { firstName, lastName, email, message } = formData;

            if (!firstName.trim() || !lastName.trim() || !email.trim() || !message.trim()) {
                toast.error('Please fill in all the required fields.');
                return;
            }
            setLoading(true);

            const payload = {
                access_key: process.env.NEXT_PUBLIC_WEB3FORMS_PUBLIC_KEY,
                name: `${firstName} ${lastName}`,
                email: email,
                message: message,
            };

            try {
                const res = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                const result = await res.json();

                if (result.success) {
                    toast.success("Thanks for reaching out! We'll get back to you shortly.");
                    setFormData(initialFormState);
                } else
                    toast.error('Failed to send message. Please try again.');
            } catch {
                toast.error('Network error. Please try again.');
            } finally {
                setLoading(false);
            }
        },
        [formData]
    );

    const renderInput = (
        name: string,
        type: 'text' | 'email',
        placeholder: string
    ) => (
        <input
            type={type}
            name={name}
            placeholder={placeholder}
            value={formData[name as keyof typeof formData]}
            onChange={handleChange}
            required
            aria-label={placeholder}
        />
    );

    return (
        <div className="contact-container">
            <h1>Get in Touch</h1>

            <div className='contact-top'>
                <div className="grid">
                    {contactData.map((item, index) => (
                        <div className="card" key={index}>
                            <div className="country">{item.country}</div>
                            <div className="info">
                                <p><FaMapMarkerAlt /> Address</p>
                                <p>{item.address}</p>
                            </div>
                            <div className="info">
                                <p><FaPhoneAlt /> Phone</p>
                                <p>{item.phone}</p>
                            </div>
                            <div className="info">
                                <p><FaEnvelope />{" "} E-mail</p>
                                <a href={`mailto:${item.email}`}>{item.email}</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="contact-form-section">
                <div className="form-header">
                    <h2>Drop Us a Line</h2>
                    <p>Reach out to us from our contact form and we will get back to you shortly.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="name-fields">
                        {renderInput('firstName', 'text', 'First Name*')}
                        {renderInput('lastName', 'text', 'Last Name*')}
                    </div>
                    {renderInput('email', 'email', 'Email*')}
                    <textarea
                        name="message"
                        placeholder="Message*"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        aria-label="Message"
                    />
                    <button type="submit" className="primary-btn" disabled={loading}>
                        {loading ? 'Sending...' : 'Send Message'}
                    </button>
                    <p className="note">* These fields are required.</p>
                </form>
            </div>
        </div>
    );
};

export default Page;
