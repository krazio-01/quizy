'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/utils/axios';
import { toast } from 'sonner';
import './welcome.scss';

const preferences = [
    {
        id: 'robotics',
        title: "I'd Like To Explore Robotics Classes / Camps",
        desc: 'Engaging, Hands-On Robotics Programs By Robofun Lab Designed To Build Real-World STEM Skills.',
        link: { text: 'know more', url: 'https://robofunlab.com/' },
    },
    {
        id: 'genwise',
        title: "I'm Interested In GenWise Online Courses",
        desc: "Curated Experiences That Challenge And Nurture Gifted Learners. We'll Send You Detailed Information Soon.",
        link: { text: 'know more', url: 'https://giftedworld.org/scourses/' },
    },
    {
        id: 'ats',
        title: "I'd Like To Know More About The ASSET Talent Search (ATS)",
        desc: "Learn How Your Child Can Qualify For India's Premier Platform For Academically Talented Students.",
        link: { text: 'know more', url: 'https://ei.study/ei-asset-talent-search/' },
    },
    {
        id: 'competitions',
        title: 'Keep Me Informed About Future Competitions By Educational Initiatives (Ei)',
        desc: 'Stay Updated On Upcoming Logic, Math, And Critical Thinking Contests Your Child May Love.',
        link: { text: 'know more', url: 'https://www.ei.study' },
    },
];

export default function PreferenceForm() {
    const [selected, setSelected] = useState<string[]>([]);
    const [hydrated, setHydrated] = useState(false);
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const togglePreference = (id: string) => {
        setSelected((prev) => (prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const email = localStorage.getItem('userEmail');
            await axios.post('/api/user/updatePreferences', {
                email,
                preferences: selected,
            });

            toast.success('Preferences saved successfully!');
            router.replace('/quiz/contest/info');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to save preferences.');
        } finally {
            setLoading(false);
            localStorage.removeItem('userEmail');
        }
    };

    useEffect(() => {
        const email = localStorage.getItem('userEmail');
        if (!email) router.replace('/');
        else setHydrated(true);
    }, [router]);

    if (!hydrated) return <div className="empty-div"></div>;

    return (
        <div className="preferences-wrapper">
            <div className="banner-section">
                <video autoPlay muted loop playsInline>
                    <source src="/videos/homepageBanner.mp4" type="video/mp4" />
                </video>

                <div className="content">
                    <h3>You&apos;re almost In!</h3>
                    <p>Take your first step toward brilliance!</p>
                </div>
            </div>

            <div className="preferences-section-wrapper">
                <h3>Tell us your preference </h3>
                <p>
                    We&apos;d love to know what excites you most! Select your preferences below so we can share the
                    right opportunities, programs, and updates with you.
                </p>

                <form onSubmit={handleSubmit} className="preference-section">
                    {preferences.map((item) => (
                        <label key={item.id}>
                            <input
                                type="checkbox"
                                value={item.id}
                                checked={selected.includes(item.id)}
                                onChange={() => togglePreference(item.id)}
                            />
                            <div>
                                <strong>{item.title}</strong>
                                <p>
                                    {item.desc}{' '}
                                    {item.link && (
                                        <a
                                            href={item.link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="know-more"
                                        >
                                            {item.link.text}
                                        </a>
                                    )}
                                </p>
                            </div>
                        </label>
                    ))}

                    <button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Submit'}
                    </button>
                </form>
            </div>
        </div>
    );
}
