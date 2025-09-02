'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { FiRotateCcw } from 'react-icons/fi';
import ccs from 'countrycitystatejson';
import { Boards } from './boards';
import schoolList from './schoolList_ISO.json';

interface School {
    id: string;
    name: string;
    address?: string;
    type?: string;
}

export const countryCities: Record<string, string[]> = {
    AE: ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al-Quwain', 'Ras Al Khaimah', 'Fujairah'],
    BH: ['Manama', 'Riffa', 'Muharraq', 'Hamad Town', "A'ali", 'Isa Town', 'Sitra'],
    QA: [
        'Doha',
        'Al Rayyan',
        'Al Wakrah',
        'Al Khor',
        'Umm Salal',
        'Madinat ash Shamal',
        'Dukhan',
        'Mesaieed',
        'Lusail',
    ],
    SA: [
        'Riyadh',
        'Jeddah',
        'Khamis Mushayt',
        'Abqaiq',
        'Makkah',
        'Al Khobar',
        'Medina',
        'Yanbu',
        'Al Madinah',
        'Dhahran',
        "Ha'il",
        'Al-Ahsa',
        'Hofuf',
        'Taif',
        'Buraydah',
        'Buraidah',
        'Tabuk',
        'Al Jubail',
        'Jubail',
        'Abha',
        'King Khalid Military City',
        'King Abdullah Economic City',
        'Udhailiyah',
        'Al Hasa',
    ],
    KW: [
        'Kuwait City',
        'Fahaheel',
        'Hawalli',
        'Fintas',
        'Al Ahmadi',
        'Al Jahra',
        'Jabriya',
        'Salwa',
        'Adan',
        'Jleeb Al Shuyoukh',
        'Shuwaikh',
        'Mangaf',
        'Mahboula',
        'Salmiya',
    ],
    OM: [
        'Muscat',
        'Salalah',
        'Sohar',
        'Hay Al Sharooq',
        'Buraimi',
        'Nizwa',
        'Muladha',
        'Sur',
        'Ibri',
        'Ibra',
        'Jalan',
        'Rustaq',
        'Khasab',
        'Al Buraimi',
        'Masirah',
        'Thumrait',
        'Saham',
        'Bousher',
    ],
    ZA: [
        'Eastern Cape',
        'Free State',
        'Gauteng',
        'Kwa Zulu-Natal',
        'KwaZulu-Natal',
        'Limpopo',
        'Mpumalanga',
        'North Cape',
        'North West',
        'North west',
        'Western Cape',
    ],
    KE: [
        'Nairobi',
        'Kisumu',
        'Mombasa',
        'Nanyuki',
        'Thika',
        'Limuru',
        'Eldoret',
        'Kisii',
        'Nakuru',
        'Kalimoni',
        'Kilifi',
        'Malindi',
        'Nyeri',
        'Kajiado',
        'Kiambu',
        'Gilgil',
        'Ruiru',
        'Kijabe',
        'Molo',
        'Diani',
    ],
};

const Step3 = ({
    onNext,
    loading,
    fieldErrors,
}: {
    onNext: (data: any) => void;
    loading: boolean;
    fieldErrors: { [key: string]: string };
}) => {
    const countries = ccs.getCountries();
    const [country, setCountry] = useState('');
    const [cities, setCities] = useState<string[]>([]);
    const [city, setCity] = useState('');
    const [customCity, setCustomCity] = useState('');
    const [schools, setSchools] = useState<School[]>([]);
    const [school, setSchool] = useState('');
    const [customSchool, setCustomSchool] = useState('');
    const [board, setBoard] = useState('');
    const [customBoard, setCustomBoard] = useState('');
    const [grade, setGrade] = useState('');
    const [loadingSchools, setLoadingSchools] = useState(false);
    const [schoolError, setSchoolError] = useState('');

    useEffect(() => {
        setCity('');
        setSchools([]);
        setSchool('');
        setCustomSchool('');

        if (!country) {
            setCities([]);
            return;
        }

        if (countryCities[country]) {
            setCities([...countryCities[country]]);
            return;
        }

        const states = ccs.getStatesByShort(country);
        const citySet = new Set<string>();

        states?.forEach((state: string) => {
            ccs.getCities(country, state)?.forEach((c: string) => citySet.add(c));
        });
        const cityList = Array.from(citySet).sort();

        setCities(cityList);
    }, [country]);

    const fetchSchools = useCallback(async (countryCode: string, cityName: string) => {
        setLoadingSchools(true);
        setSchoolError('');

        try {
            const countryEntry = schoolList.find((c) => c.country.toLowerCase() === countryCode.toLowerCase());

            const localSchools =
                countryEntry?.schools
                    ?.filter((s) => s.City.toLowerCase() === cityName.toLowerCase())
                    .map((s, index) => ({
                        id: `local-${index}`,
                        name: truncateText(s.school, getTruncateLength()),
                        fullName: s.school,
                    })) ?? [];

            localSchools?.push({
                id: 'other',
                name: 'Other (Please specify)',
                fullName: 'Other (Please specify)',
            });

            setSchools(localSchools);
            setSchool('');
            setCustomSchool('');
        } catch (error) {
            console.error('Error fetching schools:', error);
            setSchoolError('Failed to load schools. Please try again.');
        } finally {
            setLoadingSchools(false);
        }
    }, []);

    useEffect(() => {
        if (country && city) {
            fetchSchools(country, city);
        } else {
            setSchools([]);
            setSchool('');
            setCustomSchool('');
        }
    }, [country, city, fetchSchools]);

    useEffect(() => {
        setGrade('');
    }, [board]);

    const getGradeOptions = () => {
        const normalized = board.toLowerCase();

        if (normalized === 'cambridge') return Array.from({ length: 8 }, (_, i) => `Year ${i + 4}`);

        return Array.from({ length: 8 }, (_, i) => `Grade ${i + 3}`);
    };

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
    };

    const getTruncateLength = () => {
        if (typeof window !== 'undefined') return window.innerWidth <= 768 ? 32 : 42;
        return 42;
    };

    const isValid =
        country &&
        (city === 'Other (Please specify)' ? customCity : city) &&
        (school === 'Other (Please specify)' ? customSchool : school) &&
        (board === 'Other' ? customBoard : board) &&
        grade;

    const gradeOptions = getGradeOptions();

    const handleSubmit = () => {
        if (isValid) {
            onNext({
                country,
                city: city === 'Other (Please specify)' ? customCity : city,
                school: school === 'Other (Please specify)' ? customSchool : school,
                board: board === 'Other' ? customBoard : board,
                grade,
            });
        }
    };

    return (
        <form className="step-form">
            <div className="form-group">
                <label htmlFor="country">Country</label>
                <div className="select-wrapper">
                    <select id="country" value={country} onChange={(e) => setCountry(e.target.value)} required>
                        <option value="">Choose your country</option>
                        {countries.map((c) => (
                            <option key={c.shortName} value={c.shortName}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    <FaChevronDown className="dropdown-icon" size={14} />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="city">City</label>
                <span>Select the &apos;Other&apos; option if you don&apos;t find your city in the list.</span>
                <div className="select-wrapper">
                    {city === 'Other (Please specify)' ? (
                        <div className="input-wrapper">
                            <input
                                type="text"
                                placeholder="Enter your city name"
                                value={customCity}
                                onChange={(e) => setCustomCity(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="rollback-btn"
                                onClick={() => {
                                    setCity('');
                                    setCustomCity('');
                                }}
                            >
                                <FiRotateCcw /> Back
                            </button>
                        </div>
                    ) : (
                        <>
                            <select
                                id="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                                disabled={cities.length === 0}
                            >
                                <option value="">Choose your city</option>
                                {cities.map((c) => (
                                    <option key={c} value={c}>
                                        {c}
                                    </option>
                                ))}
                                <option value="Other (Please specify)">Other (Please specify)</option>
                            </select>
                            <FaChevronDown className="dropdown-icon" size={14} />
                        </>
                    )}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="school">School</label>
                <span>Select the &apos;Other&apos; option if you don&apos;t find your school in the list.</span>
                <div className="select-wrapper">
                    {school === 'Other (Please specify)' ? (
                        <div className="input-wrapper">
                            <input
                                type="text"
                                placeholder="Enter your school name"
                                value={customSchool}
                                onChange={(e) => setCustomSchool(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="rollback-btn"
                                onClick={() => {
                                    setSchool('');
                                    setCustomSchool('');
                                }}
                            >
                                <FiRotateCcw /> Back
                            </button>
                        </div>
                    ) : (
                        <>
                            <select
                                id="school"
                                value={school}
                                onChange={(e) => setSchool(e.target.value)}
                                required
                                disabled={loadingSchools || schools?.length === 0}
                            >
                                <option value="">{loadingSchools ? 'Loading schools...' : 'Choose your School'}</option>
                                {schools?.map((s) => (
                                    <option key={s.id} value={s.name}>
                                        {s.name} {s.type && `(${s.type})`}
                                    </option>
                                ))}
                            </select>
                            <FaChevronDown className="dropdown-icon" size={14} />
                        </>
                    )}
                </div>
                {schoolError && <div className="error-message">{schoolError}</div>}
            </div>

            <div className="form-group">
                <label htmlFor="board">Board</label>
                <span>Select the &apos;Other&apos; option if you don&apos;t find your board in the list.</span>
                <div className="select-wrapper">
                    {board === 'Other' ? (
                        <div className="input-wrapper">
                            <input
                                type="text"
                                placeholder="Enter your board name"
                                value={customBoard}
                                onChange={(e) => setCustomBoard(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="rollback-btn"
                                onClick={() => {
                                    setBoard('');
                                    setCustomBoard('');
                                }}
                            >
                                <FiRotateCcw /> Back
                            </button>
                        </div>
                    ) : (
                        <>
                            <select id="board" value={board} onChange={(e) => setBoard(e.target.value)} required>
                                <option value="">Choose your Board</option>
                                {Boards.map((b, index) => (
                                    <option key={index} value={b}>
                                        {b}
                                    </option>
                                ))}
                                <option value="Other">Other</option>
                            </select>
                            <FaChevronDown className="dropdown-icon" size={14} />
                        </>
                    )}
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="grade">Grade</label>
                <div className={`select-wrapper ${fieldErrors.grade ? 'error' : ''}`}>
                    <select
                        id="grade"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        disabled={gradeOptions.length === 0}
                        required
                    >
                        <option value="">Choose your Grade</option>
                        {gradeOptions.map((label) => (
                            <option key={label} value={label.replace(/\s+/g, '').toLowerCase()}>
                                {label}
                            </option>
                        ))}
                    </select>
                    <FaChevronDown className="dropdown-icon" size={14} />
                </div>
                {fieldErrors.grade && <div className="error-message">{fieldErrors.grade}</div>}
            </div>

            <div className="form-buttons">
                <button
                    type="button"
                    className="next-btn"
                    onClick={handleSubmit}
                    disabled={!isValid || loadingSchools || loading}
                >
                    {loading ? 'Submitting...' : 'Continue to Payment!'}
                </button>
            </div>
        </form>
    );
};

export default Step3;
