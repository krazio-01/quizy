'use client';
import React, { useState } from 'react';
import './contest.scss';

const Page = () => {
    const [preferences, setPreferences] = useState(Array(5).fill(false));

    const handleToggle = (index: any) => {
        const updated = [...preferences];
        updated[index] = !updated[index];
        setPreferences(updated);
    };

    const handleSubmit = () => {
        const selected = preferences
            .map((checked, i) => (checked ? `Preference ${i + 1}` : null))
            .filter(Boolean);
        console.log('Selected:', selected);
    };

    return (
        <div className="preference-container">
            <div className="header">
                <h1>You&apos;re almost In!</h1>
                <p>Take your first step toward brilliance!</p>
            </div>

            <div className="preferences-box">
                <h2>Tell us your preference</h2>
                <p className="desc">
                    Sample text this is the sample text.hello sample text Sample text this is the sample text.hello
                    sample text Sample text this is the sample text.hello sample text Sample text this is the sample
                    text.hello sample text Sample text this is the sample text.hello sample text Sample text this is the
                    sample text.
                </p>

                <div className="checkbox-group">
                    {preferences.map((selected, i) => (
                        <label key={i} className="checkbox-item">
                            <input
                                type="checkbox"
                                checked={selected}
                                onChange={() => handleToggle(i)}
                            />
                            <span>
                                Sample text this is the sample text.hello sample text Sample text this is the sample
                                text
                            </span>
                        </label>
                    ))}
                </div>

                <button className="submit-btn" onClick={handleSubmit}>
                    Submit
                </button>
            </div>
        </div>
    );
};

export default Page;
