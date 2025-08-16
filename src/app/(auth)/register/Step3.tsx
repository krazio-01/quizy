'use client';
import React, { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import ccs from 'countrycitystatejson';
import boardsData from './boards.json';
import schoolList from './schoolList_ISO.json';

interface School {
    id: string;
    name: string;
    address?: string;
    type?: string;
}

const gradeOptions = [...Array.from({ length: 10 }, (_, i) => `Grade ${i + 3}`)];

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
    const [schools, setSchools] = useState<School[]>([]);
    const [school, setSchool] = useState('');
    const [customSchool, setCustomSchool] = useState('');
    const [boards, setBoards] = useState<string[]>([]);
    const [board, setBoard] = useState('');
    const [customBoard, setCustomBoard] = useState('');
    const [grade, setGrade] = useState('');
    const [loadingSchools, setLoadingSchools] = useState(false);
    const [schoolError, setSchoolError] = useState('');

    useEffect(() => {
        if (country) {
            const states = ccs.getStatesByShort(country);
            const citySet = new Set<string>();
            states?.forEach((state: string) => {
                const citiesInState = ccs.getCities(country, state);
                citiesInState?.forEach((c: string) => citySet.add(c));
            });
            setCities(Array.from(citySet).sort());
            setCity('');
            setSchools([]);
            setSchool('');
            setCustomSchool('');
        } else {
            setCities([]);
            setCity('');
            setSchools([]);
            setSchool('');
            setCustomSchool('');
        }
    }, [country]);

    useEffect(() => {
        if (country && city) {
            const availableBoards = boardsData[country] || boardsData.default;
            setBoards(availableBoards);
            setBoard('');
            setCustomBoard('');

            fetchSchools(country, city);
        } else {
            setSchools([]);
            setSchool('');
            setCustomSchool('');
        }
    }, [country, city]);

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
    };

    const getTruncateLength = () => {
        if (typeof window !== 'undefined') return window.innerWidth <= 768 ? 32 : 42;
        return 42;
    };

    const fetchSchools = async (countryCode: string, cityName: string) => {
        setLoadingSchools(true);
        setSchoolError('');

        try {
            const countryEntry = schoolList.find((c) => c.country.toLowerCase() === countryCode.toLowerCase());

            if (countryEntry) {
                const localSchools = countryEntry.schools
                    .filter((s) => s.City.toLowerCase() === cityName.toLowerCase())
                    .map((s, index) => ({
                        id: `local-${index}`,
                        name: truncateText(s.school, getTruncateLength()),
                        fullName: s.school,
                    }));

                localSchools.push({
                    id: 'other',
                    name: 'Other (Please specify)',
                    fullName: 'Other (Please specify)',
                });

                setSchools(localSchools);
                setSchool('');
                setCustomSchool('');
            } else {
                const overpassQuery = `
                [out:json][timeout:25];
                (
                  node["amenity"~"^(school|university|college)$"]["addr:city"="${cityName}"];
                  way["amenity"~"^(school|university|college)$"]["addr:city"="${cityName}"];
                  relation["amenity"~"^(school|university|college)$"]["addr:city"="${cityName}"];
                );
                out center meta;
            `;

                const response = await fetch('https://overpass-api.de/api/interpreter', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `data=${encodeURIComponent(overpassQuery)}`,
                });

                if (!response.ok) throw new Error('Failed to fetch schools');

                const data = await response.json();
                const fetchedSchools: School[] = data.elements
                    .filter((element: any) => element.tags && element.tags.name)
                    .map((element: any, index: number) => ({
                        id: element.id?.toString() || `school-${index}`,
                        name: element.tags.name,
                        address: element.tags['addr:full'] || element.tags['addr:street'] || '',
                    }));

                fetchedSchools.push({ id: 'other', name: 'Other (Please specify)' });

                setSchools(fetchedSchools);
                setSchool('');
                setCustomSchool('');
            }
        } catch (error) {
            console.error('Error fetching schools:', error);
            setSchoolError('Failed to load schools. Please try again.');
        } finally {
            setLoadingSchools(false);
        }
    };

    const isValid = country && city && (school || customSchool) && (board || customBoard) && grade;

    const handleSubmit = () => {
        if (isValid) {
            onNext({
                country,
                city,
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
                <div className="select-wrapper">
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
                    </select>
                    <FaChevronDown className="dropdown-icon" size={14} />
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="school">School</label>
                <div className="select-wrapper">
                    {school === 'Other (Please specify)' ? (
                        <input
                            type="text"
                            placeholder="Enter your school name"
                            value={customSchool}
                            onChange={(e) => setCustomSchool(e.target.value)}
                            required
                        />
                    ) : (
                        <>
                            <select
                                id="school"
                                value={school}
                                onChange={(e) => setSchool(e.target.value)}
                                required
                                disabled={loadingSchools || schools.length === 0}
                            >
                                <option value="">{loadingSchools ? 'Loading schools...' : 'Choose your School'}</option>
                                {schools.map((s) => (
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
                <div className="select-wrapper">
                    {board === 'Other' ? (
                        <input
                            type="text"
                            placeholder="Enter your board name"
                            value={customBoard}
                            onChange={(e) => setCustomBoard(e.target.value)}
                            required
                        />
                    ) : (
                        <>
                            <select
                                id="board"
                                value={board}
                                onChange={(e) => setBoard(e.target.value)}
                                required
                                disabled={boards.length === 0}
                            >
                                <option value="">Choose your Board</option>
                                {boards.map((b, index) => (
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
                    <select id="grade" value={grade} onChange={(e) => setGrade(e.target.value)} required>
                        <option value="">Choose your Grade</option>
                        {gradeOptions.map((label) => (
                            <option key={label} value={label.replace(' ', '').toLowerCase()}>
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
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Continue to Payment!'}
                </button>
            </div>
        </form>
    );
};

export default Step3;
