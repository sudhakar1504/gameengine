"use client"
import React, { useEffect, useRef, useState } from 'react';

interface PreviewElementProps {
    item: any;
    onPageChange: (pageId: number) => void;
    width?: number;
    height?: number;
    onTriggerAnimation?: (elementId: string | number, animConfig: any) => void;
    externalAnimTrigger?: { config: any; tick: number };
    onDrop?: (sourceId: string | number, dropXPct: number, dropYPct: number) => void;
    onDragStart?: (sourceId: string | number) => void;
    externalActions?: { actions: any[]; tick: number };
    isDropped?: boolean;
}

const PreviewElement = ({ item, onPageChange, width, height, onTriggerAnimation, externalAnimTrigger, onDrop, onDragStart, externalActions, isDropped }: PreviewElementProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    let parentElement = width;
    const [isHovered, setIsHovered] = useState(false);
    const [audio] = useState(() => (item.type === 'audio' || item.interaction?.audioSrc !== '') ? new Audio() : null);
    const [activeEffect, setActiveEffect] = useState<string | null>(null);

    // Drag state for drag-drop elements
    const hasDragDrop = !!item.dragDrop?.dropTargetId;
    const [dragDelta, setDragDelta] = useState<{ x: number; y: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartRef = useRef<{ mouseX: number; mouseY: number } | null>(null);

    // Mouse drag handler for drag-drop elements
    const handleDragMouseDown = (e: React.MouseEvent) => {
        if (!hasDragDrop || isDropped) return;
        e.preventDefault();
        e.stopPropagation();
        dragStartRef.current = { mouseX: e.clientX, mouseY: e.clientY };
        setIsDragging(true);
        onDragStart?.(item.id);

        const onMove = (ev: MouseEvent) => {
            if (!dragStartRef.current) return;
            setDragDelta({ x: ev.clientX - dragStartRef.current.mouseX, y: ev.clientY - dragStartRef.current.mouseY });
        };

        const onUp = (ev: MouseEvent) => {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
            setIsDragging(false);
            if (!dragStartRef.current || !width || !height) { dragStartRef.current = null; return; }
            const dxPct = ((ev.clientX - dragStartRef.current.mouseX) / width) * 100;
            const dyPct = ((ev.clientY - dragStartRef.current.mouseY) / height) * 100;
            const finalX = item.coords.x + item.coords.width / 2 + dxPct;
            const finalY = item.coords.y + item.coords.height / 2 + dyPct;
            dragStartRef.current = null;
            // Don't reset dragDelta yet — let Preview decide via externalActions
            onDrop?.(item.id, finalX, finalY);
        };

        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
    };

    // Handle external actions from Preview (correct drop snap, wrong drop snap-back, effects, etc.)
    useEffect(() => {
        if (!externalActions?.actions?.length) return;
        externalActions.actions.forEach((action: any) => {
            if (action.type === 'snap-to') {
                setDragDelta({ x: action.dx, y: action.dy });
            }
            if (action.type === 'snap-back' || action.type === 'return-to-origin') {
                setDragDelta(null);
            }
            if (action.type === 'audio' && action.audioSrc) {
                const a = new Audio(action.audioSrc);
                a.loop = action.loop || false;
                a.play().catch(e => console.error('Audio playback failed', e));
            }
            if (action.type === 'effect' && action.effectValue) {
                setActiveEffect(action.effectValue);
                setTimeout(() => setActiveEffect(null), 3000);
            }
            if (action.type === 'animation' && contentRef.current) {
                const effect = action.animEffect || 'none';
                if (effect === 'none') return;
                let kf = effect;
                if (effect === 'slide' && action.animDirection !== 'none') kf = `slide-${action.animDirection}`;
                const speed = action.animSpeed || 1;
                contentRef.current.style.animation = 'none';
                void contentRef.current.offsetWidth;
                contentRef.current.style.animation = `${kf} ${speed}s ease both`;
                setTimeout(() => { if (contentRef.current) contentRef.current.style.animation = ''; }, speed * 1000);
            }
            if (action.type === 'go-to-page' && action.targetPageId) {
                onPageChange(Number(action.targetPageId));
            }
        });
    }, [externalActions?.tick]);

    // Initial styles from coords
    const style: React.CSSProperties = {
        position: 'absolute',
        left: `${item.coords.x}%`,
        top: `${item.coords.y}%`,
        width: `${item.coords.width}%`,
        height: `${item.coords.height}%`,
        transform: dragDelta
            ? `translate(${dragDelta.x}px, ${dragDelta.y}px) rotate(${item.coords.angle || 0}deg)`
            : `rotate(${item.coords.angle || 0}deg)`,
        zIndex: isDragging ? 9999 : (item.zIndex || 1),
        cursor: hasDragDrop && !isDropped ? (isDragging ? 'grabbing' : 'grab') : (item.interaction?.type !== 'none' ? 'pointer' : 'default'),
        transition: isDragging ? 'none' : (dragDelta ? 'transform 0.3s ease' : undefined),
        userSelect: 'none',
    };

    // Helper to get animation CSS string
    const getAnimString = (anim: any, loop: boolean = false) => {

        if (!anim || anim.effect === 'none') return '';
        let keyframeName = anim.effect;
        if (anim.effect === 'slide' && anim.direction !== 'none') {
            keyframeName = `slide-${anim.direction}`;
        }
        const playDirection = anim.animationDirection || 'normal';
        const transitionType = anim.transitionType || 'ease';
        let s = `${keyframeName} ${anim.speed || 1}s ${transitionType} ${anim.delay || 0}s ${playDirection} both`;
        if (loop) {
            s += ' infinite' // removed alternate since it's now handled by playDirection
        }
        return s;
    };

    // Apply Entrance and Continuous animations
    useEffect(() => {
        if (!contentRef.current || !item.animations) return;

        const entrance = getAnimString(item.animations.entrance);
        const continuous = getAnimString(item.animations.continuous, true);

        let anims = [];
        if (entrance) anims.push(entrance);
        if (entrance) {
            setTimeout(() => {
                if (continuous) {
                    anims.push(continuous);
                    contentRef.current?.style.setProperty('animation', anims.join(', '));
                };
            }, item.animations.entrance?.speed * 1000 + item.animations.entrance?.delay * 1000);
        } else {
            if (continuous) {
                anims.push(continuous);
            };
        }

        contentRef.current?.style.setProperty('animation', anims.join(', '));

    }, [item.animations]);

    // Handle Hover animation
    useEffect(() => {
        if (!contentRef.current || !item.animations?.hover) return;
        if (isHovered) {
            const hov = getAnimString(item.animations.hover);
            if (hov) {
                let previousAnimation = getAnimString(item.animations.continuous, true);
                setTimeout(() => {
                    contentRef.current?.style.setProperty('animation', `${previousAnimation}`);
                }, item.animations.hover.speed * 1000 + item.animations.hover.delay * 1000);
                contentRef.current.style.animation = `${hov}`;
            }
        } else {
            // Restore continuous if present
            // const continuous = getAnimString(item.animations.continuous, true);
            // contentRef.current.style.animation = continuous || 'none';
        }
    }, [isHovered]);

    // Fire animation on this element when triggered externally
    useEffect(() => {
        if (!externalAnimTrigger || !contentRef.current) return;
        const anim = getAnimString(externalAnimTrigger.config);
        if (!anim) return;
        const continuous = getAnimString(item.animations?.continuous, true);
        contentRef.current.style.animation = anim;
        const duration = ((externalAnimTrigger.config.speed || 1) + (externalAnimTrigger.config.delay || 0)) * 1000;
        setTimeout(() => {
            if (contentRef.current) {
                contentRef.current.style.animation = continuous || 'none';
            }
        }, duration);
    }, [externalAnimTrigger?.tick]);

    const handleClick = () => {
        // 1. Play Click animation
        if (contentRef.current && item.animations?.click) {
            const clk = getAnimString(item.animations.click);
            if (clk) {
                let previousAnimation = getAnimString(item.animations.continuous, true);
                setTimeout(() => {
                    contentRef.current?.style.setProperty('animation', `${previousAnimation}`);
                }, item.animations.click.speed * 1000 + item.animations.click.delay * 1000);
                contentRef.current.style.animation = `${clk}`;
            }
        }

        // 2. Handle Interaction
        const inter = item.interaction;

        // Handle Trigger Animation Interaction
        if (inter?.type === 'triggerAnim' && inter?.triggerElementId && onTriggerAnimation) {
            onTriggerAnimation(inter.triggerElementId, inter.triggerAnimationConfig);
            return;
        }

        // Handle Effect Interaction
        if (inter?.effectValue != "") {
            setActiveEffect(inter.effectValue);
            setTimeout(() => {
                setActiveEffect(null);
            }, 3000); // 3 seconds duration

        }

        const checkOtherInteraction = () => {
            if (inter?.targetPageId) {
                onPageChange(Number(inter.targetPageId));
                return;
            }
            if (inter?.url) {
                window.open(inter.url, inter?.target ? '_blank' : '_self');
                return;
            }
        }

        if (inter?.audioSrc && inter?.audioSrc !== "" && audio) {
            audio.src = inter?.audioSrc;
            audio.play().catch(e => console.error("Audio playback failed", e));
            audio.addEventListener('ended', () => {
                audio.pause();
                audio.currentTime = 0;
                checkOtherInteraction();
            });
        } else {
            checkOtherInteraction();
        }
    };

    // Handle Auto-play Audio if the element is an audio element
    useEffect(() => {
        if (item.type === 'audio' && item?.src && audio) {
            audio.src = item.src;
            audio.loop = item.audio.loop || false;
            audio.volume = (item.audio.volume ?? 100) / 100;
            audio.play().catch(e => console.error("Autoplay failed", e));
        }
        return () => {
            if (audio) {
                audio.pause();
                audio.src = '';
            }
        };
    }, [item.id, item.audio]);

    // get parent width when containerRef changes
    useEffect(() => {
        if (containerRef.current) {
            // parentElement = containerRef.current.parentElement;
        }
    }, []);

    return (
        <>
            {activeEffect && <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 999999999,
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent'
            }}>
                <EffectLayer type={activeEffect || ''} />
            </div>}
            <div
                ref={containerRef}
                style={style}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseDown={hasDragDrop ? handleDragMouseDown : undefined}
                onClick={hasDragDrop ? undefined : handleClick}
            >
                <div
                    ref={contentRef}
                    className="w-full h-full relative"
                >

                    {item.type === 'group' && item.children && (
                        <div className="w-full h-full relative pointer-events-none">
                            {item.children.map((child: any, i: number) => (
                                <div key={i} style={{
                                    position: 'absolute',
                                    left: `${child.coords.x}%`,
                                    top: `${child.coords.y}%`,
                                    width: `${child.coords.width}%`,
                                    height: `${child.coords.height}%`,
                                    transform: `rotate(${child.coords.angle || 0}deg)`
                                }}>
                                    {child.type === 'img' && <img src={child.src} className="w-full h-full object-contain" alt="" />}
                                    {child.type === 'text' && <div style={{ ...child.font, fontSize: `${(child.font?.fontSize / 100) * (parentElement || 1000)}vw` }}>{child.text}</div>}
                                    {/* Note: Font size in groups might need scaling logic or be simpler */}
                                </div>
                            ))}
                        </div>
                    )}

                    {item.type === 'img' && <img
                        loading='lazy'
                        src={item.src}
                        alt=""
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain',
                            filter: `opacity(${item.filter?.opacity ?? 100}%) brightness(${item.filter?.brightness ?? 100}%) contrast(${item.filter?.contrast ?? 100}%) saturate(${item.filter?.saturate ?? 100}%) blur(${item.filter?.blur ?? 0}px)`,
                            transform: `scaleX(${item.transform?.flipX ? -1 : 1}) scaleY(${item.transform?.flipY ? -1 : 1})`
                        }}
                    />}
                    {item.type === 'text' && parentElement && <div style={{
                        ...item.font,
                        fontSize: `${(item.font?.fontSize / 100) * (parentElement || 1000)}vw`,
                        width: '100%',
                        height: '100%',
                    }}>{item.text}</div>}

                    {/* Audio icon removed in preview, it's just a functional element */}
                </div>
            </div>
        </>
    );
};

import EffectLayer from '../Effects/EffectLayer';

export default PreviewElement;
