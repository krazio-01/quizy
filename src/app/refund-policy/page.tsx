import { refundPolicySections } from './refundData';
import LegalSection from '../../components/legal/LegalSection';
import './refund.scss';

const Page = () => {
    return (
        <div className="refund-container">
            <h2>Registration and Refund Information</h2>
            {refundPolicySections.map((section, index) => (
                <LegalSection key={index} {...section} />
            ))}
        </div>
    );
};

export default Page;
