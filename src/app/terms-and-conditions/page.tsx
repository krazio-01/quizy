import React from 'react';
import { termsSections } from './termsData';
import LegalSection from '../../components/legal/LegalSection';
import './terms.scss';

const TermsAndConditions = () => {
    return (
        <div className="terms-container">
            {termsSections.map((section, index) => (
                <LegalSection key={index} {...section} />
            ))}

            <p className="acknowledgement">
                <strong>
                    By using the Site, you acknowledge that you have read, understood, and agree to be bound by these
                    Terms of Use.
                </strong>
            </p>
        </div>
    );
};

export default TermsAndConditions;
