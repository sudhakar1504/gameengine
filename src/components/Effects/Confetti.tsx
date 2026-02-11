import React, { useEffect, useState } from 'react';

const colors = ['#f00', '#0f0', '#00f', '#ff0', '#f0f', '#0ff'];

const Confetti = () => {
    const [particles, setParticles] = useState<any[]>([]);

    useEffect(() => {
        const p = [];
        for (let i = 0; i < 50; i++) {
            p.push({
                id: i,
                left: Math.random() * 100,
                color: colors[Math.floor(Math.random() * colors.length)],
                delay: Math.random() * 2,
                duration: 2 + Math.random() * 2
            });
        }
        setParticles(p);
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <style>
                {`
                @keyframes confetti-fall {
                    0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
                }
                `}
            </style>
            {particles.map((p) => (
                <div
                    key={p.id}
                    style={{
                        position: 'absolute',
                        left: `${p.left}%`,
                        top: '-10px',
                        width: '10px',
                        height: '10px',
                        backgroundColor: p.color,
                        animation: `confetti-fall ${p.duration}s linear ${p.delay}s forwards`,
                    }}
                />
            ))}
        </div>
    );
};

export default Confetti;
