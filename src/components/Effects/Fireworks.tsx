import React from 'react';

const Fireworks = () => {
    // Simple DOM-based fireworks using CSS animations
    // Create multiple explosions
    const explosions = [1, 2, 3, 4, 5];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <style>
                {`
                @keyframes firework-explode {
                    0% { transform: scale(0); opacity: 1; }
                    100% { transform: scale(20); opacity: 0; }
                }
                `}
            </style>
            {explosions.map((id) => (
                <div
                    key={id}
                    style={{
                        position: 'absolute',
                        left: `${20 + Math.random() * 60}%`,
                        top: `${20 + Math.random() * 40}%`,
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
                        boxShadow: `0 0 10px 2px currentColor`,
                        animation: `firework-explode 1s ease-out ${Math.random()}s forwards`
                    }}
                />
            ))}
        </div>
    );
};

export default Fireworks;
