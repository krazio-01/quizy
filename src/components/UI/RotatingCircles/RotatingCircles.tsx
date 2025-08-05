import './circles.scss';

interface RotatingCircleProps {
    size?: number;
    centerDotSize?: number;
    orbitDotSize?: number;
    orbitRadius?: number;
    orbitDuration?: number;
    position?: { top?: string; bottom?: string; left?: string; right?: string };
}

const RotatingCircle: React.FC<RotatingCircleProps> = ({
    size = 300,
    centerDotSize = 25,
    orbitDotSize = 15,
    orbitRadius = 20,
    orbitDuration = 6,
    position = { top: '10%', left: '5%' },
}) => {
    return (
        <div className="rotating-circle-wrapper" style={{ ...position, width: size, height: size }}>
            <div className="outer-circle" style={{ width: size, height: size }} />

            <div
                className="center-dot"
                style={{
                    width: centerDotSize,
                    height: centerDotSize,
                    top: `calc(50% - ${centerDotSize / 2}px)`,
                    left: `calc(50% - ${centerDotSize / 2}px)`,
                }}
            />

            <div
                className="orbit-container"
                style={{
                    width: orbitRadius * 2,
                    height: orbitRadius * 2,
                    top: `calc(50% - ${orbitRadius}px)`,
                    left: `calc(50% - ${orbitRadius}px)`,
                    animationDuration: `${orbitDuration}s`,
                }}
            >
                <div
                    className="orbit-dot"
                    style={{
                        width: orbitDotSize,
                        height: orbitDotSize,
                        top: 0,
                        left: `calc(50% - ${orbitDotSize / 2}px)`,
                    }}
                />
            </div>
        </div>
    );
};

export default RotatingCircle;
