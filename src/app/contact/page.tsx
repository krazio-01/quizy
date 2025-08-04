'use client';
import React, { useState } from 'react';
import './contact.scss';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';

const Page = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        message: '',
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulate send
        setTimeout(() => {
            setLoading(false);
            setFormData({ firstName: '', lastName: '', email: '', message: '' });
            alert('Message sent!');
        }, 1000);
    };

    return (
        <div className="contact-container">
            <h1>Get in Touch</h1>
            <div className="contact-top">
                <div className="contact-info">
                    <div className='info-section'>
                        <div>
                            <FaMapMarkerAlt className="icon" />
                            <span>Address</span>
                        </div>
                        <p>The First Building, Corporate House A2, 1st Floor, Nyay Marg, Vastrapur, Ahmedabad</p>
                    </div>
                    <div className='info-section'>
                        <div>
                            <FaPhoneAlt className="icon" />
                            <span>Phone</span>
                        </div>
                        <p>+91-7946011589</p>
                    </div>
                    <div className='info-section'>
                        <div>
                            <FaEnvelope className="icon" />
                            <span>E-mail</span>
                        </div>
                        <p><a href="mailto:admin@regaloutsourceindia.com">admin@regaloutsourceindia.com</a></p>
                    </div>
                </div>
                <div className="contact-map">
                    <div className="map-placeholder"></div>
                </div>
            </div>

            <div className="contact-form-section">
                <div className='form-header'>
                    <h2>Drop Us a Line</h2>
                    <p>Reach out to us from our contact form and we will get back to you shortly.</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="name-fields">
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name*"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name*"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email*"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="message"
                        placeholder="Message*"
                        value={formData.message}
                        onChange={handleChange}
                        required
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
