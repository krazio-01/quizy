import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
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

const CTASection = async ({ buttonText, bannerText, videoSrc, link }: CTASectionProps) => {
    const session = await getServerSession(authOptions);

    return (
        <section className="practice-cta-wrapper">
            <video autoPlay muted loop playsInline>
                <source src={videoSrc} type="video/mp4" />
            </video>
            <p style={bannerText?.style}>{bannerText?.text}</p>

            {session ? (
                <Link href="/profile" className="cta-btn">
                    Go to Profile
                </Link>
            ) : (
                <Link href={link} className="cta-btn">
                    {buttonText}
                </Link>
            )}
        </section>
    );
};

export default CTASection;
