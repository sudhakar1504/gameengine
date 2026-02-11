import React, { useEffect, useState } from 'react';

interface FloatingIconsProps {
    icon: string;
}

const FloatingIcons = ({ icon }: FloatingIconsProps) => {
    const [elements, setElements] = useState<any[]>([]);

    useEffect(() => {
        const el = [];
        for (let i = 0; i < 30; i++) {
            el.push({
                id: i,
                left: Math.random() * 90, // Avoid edge
                delay: Math.random() * 1.5,
                duration: 2 + Math.random() * 2,
                size: 80 + Math.random() * 30
            });
        }
        setElements(el);
    }, []);

    return (
        <div className="absolute w-full h-full inset-0 overflow-hidden pointer-events-none">
            <style>
                {`
                @keyframes float-up {
                    0% { transform: translateY(20%) translateX(0); opacity: 0; }
                    10% { opacity: 1; }
                    100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
                }
                `}
            </style>
            {elements.map((e) => (
                <div
                    key={e.id}
                    style={{
                        position: 'absolute',
                        left: `${e.left}%`,
                        bottom: '-100px',
                        opacity: 0,
                        fontSize: `${e.size}px`,
                        animation: `float-up ${1.5}s ease-in ${e.delay}s forwards`,
                    }}
                >
                    {icon}
                </div>
            ))}
        </div>
    );
};

export default FloatingIcons;
