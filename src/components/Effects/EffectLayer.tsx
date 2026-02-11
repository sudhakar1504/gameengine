import React from 'react';
import Confetti from './Confetti';
import Fireworks from './Fireworks';
import FloatingIcons from './FloatingIcons';

interface EffectLayerProps {
    type: string | null;
}

const EffectLayer = ({ type }: EffectLayerProps) => {
    switch (type) {
        case 'confetti':
            return <Confetti />;
        case 'fireworks':
            return <Fireworks />;
        case 'hearts':
            return <FloatingIcons icon="❤️" />;
        case 'balloons':
            return <FloatingIcons icon="🎈" />;
        case 'sad':
            return <FloatingIcons icon="😢" />;
        case 'broken-heart':
            return <FloatingIcons icon="💔" />;
        case 'bubbles':
            return <FloatingIcons icon="🫧" />;
        case 'disagree':
            return <FloatingIcons icon="👎" />;
        case 'applause':
            return <FloatingIcons icon="👏" />;
        default:
            return null;
    }
};

export default EffectLayer;
