import { refundPolicySections } from './refundData';
import LegalSection from '../../components/legal/LegalSection';
import './refund.scss';

const Page = () => {
    return (
        <div className="terms-container">
            <h2>Registration and Refund Information</h2>
            {refundPolicySections.map((section, index) => (
                <LegalSection key={index} {...section} />
            ))}

            <p className="acknowledgement">
                <strong>
                    By using the Site, you acknowledge that you have read and understood our Privacy Policy.
                </strong>
            </p>
        </div>
    );
};

export default Page;
