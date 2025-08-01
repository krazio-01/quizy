'use client';
import React, { useState, useEffect } from 'react';
import ccs from 'countrycitystatejson';

interface School {
    id: string;
    name: string;
    address?: string;
    type?: string;
}

const Step1 = ({ onNext, loading }: { onNext: (data: any) => void, loading: boolean }) => {
    const countries = ccs.getCountries();
    const [country, setCountry] = useState('');
    const [cities, setCities] = useState<string[]>([]);
    const [city, setCity] = useState('');
    const [schools, setSchools] = useState<School[]>([]);
    const [school, setSchool] = useState('');
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
        } else {
            setCities([]);
            setCity('');
            setSchools([]);
            setSchool('');
        }
    }, [country]);

    useEffect(() => {
        if (country && city) {
            fetchSchools(country, city);
        } else {
            setSchools([]);
            setSchool('');
        }
    }, [country, city]);

    const fetchSchools = async (countryCode: string, cityName: string) => {
        setLoadingSchools(true);
        setSchoolError('');

        try {
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
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `data=${encodeURIComponent(overpassQuery)}`
            });

            if (!response.ok) {
                throw new Error('Failed to fetch schools');
            }

            const data = await response.json();
            const fetchedSchools: School[] = data.elements
                .filter((element: any) => element.tags && element.tags.name)
                .map((element: any, index: number) => ({
                    id: element.id?.toString() || `school-${index}`,
                    name: element.tags.name,
                    address: element.tags['addr:full'] || element.tags['addr:street'] || '',
                    type: element.tags.amenity
                }))

            setSchools(fetchedSchools);
            setSchool('');
        } catch (error) {
            console.error('Error fetching schools:', error);
            setSchoolError('Failed to load schools. Please try again.');
            setSchools([
                { id: 'public-school', name: 'Public School', type: 'school' },
                { id: 'private-school', name: 'Private School', type: 'school' },
                { id: 'international-school', name: 'International School', type: 'school' },
                { id: 'local-university', name: 'Local University', type: 'university' },
                { id: 'community-college', name: 'Community College', type: 'college' },
                { id: 'other', name: 'Other (Please specify)', type: 'other' }
            ]);
        } finally {
            setLoadingSchools(false);
        }
    };

    const isValid = country && city && school && grade;

    const handleSubmit = () => {
        if (isValid) {
            onNext({ country, city, school, grade });
        }
    };


    return (
        <form className="step-form">
            <div className="form-group">
                <label htmlFor="country">Country</label>
                <select
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                >
                    <option value="">Choose your country</option>
                    {countries.map((c) => (
                        <option key={c.shortName} value={c.shortName}>
                            {c.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label htmlFor="city">City</label>
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
            </div>

            <div className="form-group">
                <label htmlFor="school">School</label>
                <select
                    id="school"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    required
                    disabled={loadingSchools || schools.length === 0}
                >
                    <option value="">
                        {loadingSchools
                            ? 'Loading schools...'
                            : schools.length === 0
                                ? 'No schools available'
                                : 'Choose your School'}
                    </option>
                    {schools.map((s) => (
                        <option key={s.id} value={s.name}>
                            {s.name} {s.type && `(${s.type})`}
                        </option>
                    ))}
                </select>
                {schoolError && (
                    <div className="error-message">{schoolError}</div>
                )}
            </div>

            <div className="form-group">
                <label htmlFor="grade">Grade</label>
                <select
                    id="grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    required
                >
                    <option value="">Choose your Grade</option>
                    <option value="9">Grade 9</option>
                    <option value="10">Grade 10</option>
                    <option value="11">Grade 11</option>
                    <option value="12">Grade 12</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="postgraduate">Postgraduate</option>
                </select>
            </div>

            <div className="form-buttons">
                <button
                    type="button"
                    className="next-btn"
                    onClick={handleSubmit}
                    disabled={!isValid || loadingSchools}
                >
                    {loading ? 'Submitting...' : 'Continue to Payment!'}
                </button>
            </div>
        </form>
    );
};

export default Step1;
