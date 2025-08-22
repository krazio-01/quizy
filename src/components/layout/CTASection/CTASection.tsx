import Link from 'next/link';
import './ctaSection.scss';

interface CTASectionProps {
    buttonText: string;
    bannerText?: {
        text: string;
        style?: React.CSSProperties;
    };
    videoSrc: string;
    link: string;
}

const CTASection = ({ buttonText, bannerText, videoSrc, link }: CTASectionProps) => (
    <section className="practice-cta">
        <video autoPlay muted loop playsInline>
            <source src={videoSrc} type="video/mp4" />
        </video>
        <p style={bannerText.style}>{bannerText.text}</p>
        <Link href={link} className="cta-btn">
            {buttonText}
        </Link>
    </section>
);

export default CTASection;
