export const defaultTextConfig = {
    fontSize: "0.1",
    color: "#000000",
    fontFamily: "Arial",
    fontWeight: "normal",
    fontStyle: "normal",
    textDecoration: "none",
    textAlign: "left",
    lineHeight: "1.2",
    letterSpacing: "0",
    wordSpacing: "0",
};

export const defaultImageConfig = {
    opacity: 100, // %
    brightness: 100, // %
    contrast: 100, // %
    saturate: 100, // %
    blur: 0, // px
    flipX: false,
    flipY: false,
    rotation: 0, // usually handled by coords.angle, but good to have if we separate it
};

export const defaultInteractionConfig = {
    type: 'none', // 'none' | 'audio' | 'page' | 'link'
    audioSrc: '',
    loop: false,
    autoplay: false,
    targetPageId: '',
    url: '',
    target: '_blank' // '_blank' | '_self'
};

export const defaultAudioConfig = {
    loop: false,
    autoplay: false,
    volume: 100, // %
};

const defaultAnimSettings = {
    effect: 'none',
    direction: 'none',
    animationDirection: 'normal',
    transitionType: 'ease',
    delay: 0,
    speed: 1,
};

export const defaultAnimationConfig = {
    entrance: { ...defaultAnimSettings },
    continuous: { ...defaultAnimSettings },
    exit: { ...defaultAnimSettings },
    hover: { ...defaultAnimSettings },
    click: { ...defaultAnimSettings },
};

export const animationEffects = [
    { label: "None", value: "none" },
    { label: "Fade In", value: "fadeIn" },
    { label: "Focus", value: "focus" },
    { label: "Zoom", value: "zoom" },
    { label: "Turn On", value: "turnOn" },
    { label: "Slide", value: "slide" },
    { label: "Bounce", value: "bounce" },
    { label: "Swirl", value: "swirl" },
    { label: "Rotate", value: "rotate" },
    { label: "Roll In", value: "rollIn" },
];

export const animationDirections = [
    { label: "None", value: "none" },
    { label: "Left", value: "left" },
    { label: "Right", value: "right" },
    { label: "Top", value: "top" },
    { label: "Bottom", value: "bottom" },
];

export const playDirections = [
    { label: "Normal", value: "normal" },
    { label: "Reverse", value: "reverse" },
    { label: "Alternate", value: "alternate" },
    { label: "Alternate Reverse", value: "alternate-reverse" },
];

export const animationEasingTypes = [
    { label: "Ease", value: "ease" },
    { label: "Linear", value: "linear" },
    { label: "Ease In", value: "ease-in" },
    { label: "Ease Out", value: "ease-out" },
    { label: "Ease In Out", value: "ease-in-out" },
    { label: "Step Start", value: "step-start" },
    { label: "Step End", value: "step-end" },
];

export const fontFamilies = [
    "Arial",
    "Verdana",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Tahoma",
    "Trebuchet MS",
    "Impact",
    "Comic Sans MS",
];
