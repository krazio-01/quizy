import { privacyPolicySections } from './privacyData';
import LegalSection from '../../components/legal/LegalSection';
import './privacy.scss';

const Page = () => {
    return (
        <div className="privacy-container">
            <h2>Registration and Refund Information</h2>
            {privacyPolicySections.map((section, index) => (
                <LegalSection key={index} {...section} />
            ))}

            <p className="acknowledgement">
                <strong>
                    By using our website and participating in the League of Logic competition, you consent to the practices described in this Privacy Policy.
                </strong>
            </p>

            <p>
                Contact competition@ei.study for further policy clarification or questions. We&apos;re excited for an
                enjoyable competition experience for all!
            </p>
        </div>
    );
};

export default Page;
