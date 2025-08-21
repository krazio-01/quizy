import Link from "next/link";
import './ctaSection.scss';

const CTASection = ({ buttonText, videoSrc, link }: { buttonText: string; videoSrc: string; link: string }) => (
    <section className="practice-cta">
        <video autoPlay muted loop playsInline>
            <source src={videoSrc} type="video/mp4" />
        </video>
        <p></p>
        <Link href={link} className="cta-btn">
            {buttonText}
        </Link>
    </section>
);

export default CTASection;
