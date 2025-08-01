import React from 'react';
import './legal.scss';

interface SubSection {
    subtitle?: string;
    content?: string | React.ReactNode;
}

interface LegalSectionProps {
    title: string;
    content?: string;
    subSections?: SubSection[];
}

const LegalSection: React.FC<LegalSectionProps> = ({ title, content, subSections }) => {
    return (
        <section className="legal-section">
            <h2>{title}</h2>
            {content && <p>{content}</p>}
            {subSections?.map((sub, i) => (
                <div className="sub-section" key={i}>
                    {sub.subtitle && <h3>{sub.subtitle}</h3>}
                    <p>{sub.content}</p>
                </div>
            ))}
        </section>
    );
};

export default LegalSection;
