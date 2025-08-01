import React from 'react';
import './bar.scss';

interface StatsBarProps {
    statsArray: {
        value: string;
        label: string;
    }[];
    selectedValue?: string;
    onSelect?: (value: string) => void;
    gap?: string;
    cardWidth?: string;
}

const StatsBar = ({
    statsArray,
    selectedValue,
    onSelect,
    gap = 'clamp(2rem, 5vw, 4.5rem)',
    cardWidth = '120px',
}: StatsBarProps) => {
    return (
        <div className="stats" style={{ gap }}>
            {statsArray.map((stat) => (
                <div
                    key={stat.value}
                    className={`stat-card ${selectedValue === stat.value ? 'active' : ''}`}
                    onClick={() => onSelect?.(stat.value)}
                    style={{
                        cursor: onSelect ? 'pointer' : 'default',
                        minWidth: cardWidth,
                    }}
                >
                    <strong>{stat.value}</strong>
                    {stat.label && <span>{stat.label}</span>}
                </div>
            ))}
        </div>
    );
};

export default StatsBar;
