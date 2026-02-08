"use client"
import React, { useEffect, useRef, useState } from "react";
import Moveable from "react-moveable";
import { Popover } from "antd";
import InteractionModal from "../InteractionModal";
import AnimationDrawer from "../AnimationDrawer";


export default function DraggableBox({ item, setData, Data, index, SelectedID, setSelectedID, Allpages }: any) {
    const targetRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const [Open, setOpen] = useState(false);
    const [interactionModalOpen, setInteractionModalOpen] = useState(false);
    const [animationDrawerOpen, setAnimationDrawerOpen] = useState(false);

    // Apply animation logic
    useEffect(() => {
        if (!contentRef.current || !item.animations) return;

        const { previewTrigger, previewCategory } = item.animations;
        if (!previewTrigger) return;

        const anim = item.animations[previewCategory];
        if (!anim || anim.effect === 'none') {
            contentRef.current.style.animation = 'none';
            return;
        }

        let animStyle = '';
        const effect = anim.effect;
        const direction = anim.direction;
        const speed = anim.speed || 1;
        const delay = anim.delay || 0;

        let keyframeName = effect;
        if (effect === 'slide' && direction !== 'none') {
            keyframeName = `slide-${direction}`;
        }

        const playDirection = anim.animationDirection || 'normal';

        const transitionType = anim.transitionType || 'ease';
        animStyle = `${keyframeName} ${speed}s ${transitionType} ${delay}s ${playDirection} both`;

        if (previewCategory === 'continuous') {
            animStyle += ' infinite'; // removed alternate since it's now handled by playDirection
        }

        contentRef.current.style.animation = 'none';
        void contentRef.current.offsetWidth; // Trigger reflow
        contentRef.current.style.animation = animStyle;

    }, [item.animations?.previewTrigger]);

    // We use a Ref to store the current visual state ("frame") to avoid re-renders during drag
    // Initialize with 0s, will sync in useEffect
    const frame = useRef({
        translate: [0, 0],
        rotate: item.coords.angle || 0,
        width: 0,
        height: 0,
    });

    // Helper to apply the current frame to the DOM element
    const renderFrame = () => {
        if (!targetRef.current) return;
        const { translate, rotate, width, height } = frame.current;
        targetRef.current.style.transform = `translate(${translate[0]}px, ${translate[1]}px) rotate(${rotate}deg)`;
        targetRef.current.style.width = `${width}px`;
        targetRef.current.style.height = `${height}px`;
    };

    // Initialize & Sync with props (Data)
    useEffect(() => {
        const parent = targetRef.current?.parentElement;
        if (!parent) return;

        const parentWidth = parent.clientWidth;
        const parentHeight = parent.clientHeight;

        const x = (item.coords.x / 100) * parentWidth;
        const y = (item.coords.y / 100) * parentHeight;
        const w = (item.coords.width / 100) * parentWidth;
        const h = (item.coords.height / 100) * parentHeight;

        frame.current = {
            translate: [x, y],
            rotate: item.coords.angle || 0,
            width: w,
            height: h
        };
        renderFrame();

    }, [item.coords, Data]);

    const changeZIndex = (direction: "front" | "back") => {
        setData((prevData: any) => {
            const newData = [...prevData];
            const currentZIndex = newData[index].zIndex || 1;
            let newZIndex = currentZIndex;

            if (direction === "front") {
                const maxZIndex = Math.max(...newData.map((i: any) => i.zIndex || 1));
                newZIndex = maxZIndex + 1;
            } else {
                const minZIndex = Math.min(...newData.map((i: any) => i.zIndex || 1));
                newZIndex = minZIndex - 1;
            }

            newData[index] = {
                ...newData[index],
                zIndex: newZIndex
            };
            return newData;
        });
        setOpen(false);
    }

    const deleteItem = () => {
        setData((prevData: any) => {
            const newData = [...prevData];
            newData.splice(index, 1);
            return newData;
        });
        setOpen(false);
    }

    const handleInteraction = () => {
        setInteractionModalOpen(true);
        setOpen(false);
    }

    const saveInteraction = (interactionData: any) => {
        console.log("interactionData", interactionData);
        setData((prevData: any) => {
            const newData = [...prevData];
            newData[index] = {
                ...newData[index],
                interaction: interactionData
            };
            return newData;
        });
    }

    const handleAnimation = () => {
        setAnimationDrawerOpen(true);
        setOpen(false);
    }

    const saveAnimation = (animationData: any) => {
        setData((prevData: any) => {
            const newData = [...prevData];
            newData[index] = {
                ...newData[index],
                animations: animationData
            };
            return newData;
        });
    }

    const content = (
        <div className="flex flex-col gap-2">
            <button onClick={() => changeZIndex("front")} className="hover:bg-gray-100 px-2 py-1 rounded text-left">
                Bring to Front
            </button>
            <button onClick={() => changeZIndex("back")} className="hover:bg-gray-100 px-2 py-1 rounded text-left">
                Push to Back
            </button>
            <button className="hover:bg-gray-100 px-2 py-1 rounded text-left" onClick={handleInteraction}>
                Interaction
            </button>
            <button className="hover:bg-gray-100 px-2 py-1 rounded text-left" onClick={handleAnimation}>
                Animation
            </button>
            <button onClick={() => deleteItem()} className="hover:bg-gray-100 px-2 py-1 rounded text-left text-red-500">
                Delete
            </button>
        </div>
    );

    const saveToParent = () => {
        const finalFrame = frame.current;
        const parent = targetRef.current?.parentElement;
        if (!parent) return;

        const parentWidth = parent.clientWidth;
        const parentHeight = parent.clientHeight;

        setData((prevData: any) => {
            const newData = [...prevData];
            newData[index] = {
                ...newData[index],
                coords: {
                    ...newData[index].coords,
                    x: (finalFrame.translate[0] / parentWidth) * 100,
                    y: (finalFrame.translate[1] / parentHeight) * 100,
                    width: (finalFrame.width / parentWidth) * 100,
                    height: (finalFrame.height / parentHeight) * 100,
                    angle: finalFrame.rotate
                }
            };
            return newData;
        });
    }

    const isSelected = SelectedID === item.id;

    return (
        <>
            <Popover
                content={content}
                title="Arrange"
                trigger="contextMenu"
                open={Open}
                onOpenChange={setOpen}
            >
                <div
                    ref={targetRef}
                    onClick={() => setSelectedID(item.id)}
                    style={{
                        position: "absolute",
                        zIndex: item?.zIndex || 1,
                        cursor: "move",
                        border: isSelected ? "1px solid #1890ff" : "1px solid transparent",
                        boxSizing: "border-box",
                    }}
                >
                    <div
                        ref={contentRef}
                        className="w-full h-full relative"
                    >
                        {item.type === 'img' && <img
                            src={item.src}
                            alt=""
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain',
                                pointerEvents: 'none',
                                filter: `opacity(${item.filter?.opacity ?? 100}%) brightness(${item.filter?.brightness ?? 100}%) contrast(${item.filter?.contrast ?? 100}%) saturate(${item.filter?.saturate ?? 100}%) blur(${item.filter?.blur ?? 0}px)`,
                                transform: `scaleX(${item.transform?.flipX ? -1 : 1}) scaleY(${item.transform?.flipY ? -1 : 1})`
                            }}
                        />}
                        {item.type === 'text' && <div style={{
                            ...item.font,
                            fontSize: `${(item.font?.fontSize / 100) * (targetRef.current?.parentElement?.clientWidth || 1000)}vw`,
                            width: '100%',
                            height: '100%',
                            pointerEvents: 'none'
                        }}>{item.text}</div>}
                        {item.type === 'audio' && (
                            <div className="w-full opacity-50 h-full flex items-center justify-center bg-gray-100 rounded border border-gray-300">
                                <i className="fa-solid fa-music text-2xl text-gray-500"></i>
                            </div>
                        )}
                    </div>
                </div>
            </Popover>

            {isSelected && (
                <Moveable
                    target={targetRef}
                    draggable={true}
                    resizable={true}
                    rotatable={true}
                    throttleDrag={0}
                    throttleResize={0}
                    throttleRotate={0}
                    snappable={true}

                    /* Drag Events */
                    onDragStart={({ set }) => {
                        set(frame.current.translate);
                    }}
                    onDrag={({ beforeTranslate }) => {
                        frame.current.translate = beforeTranslate;
                        renderFrame();
                    }}
                    onDragEnd={saveToParent}

                    /* Resize Events */
                    onResizeStart={({ setOrigin, dragStart }) => {
                        setOrigin(["%", "%"]);
                        dragStart && dragStart.set(frame.current.translate);
                    }}
                    onResize={({ width, height, drag }) => {
                        frame.current.width = width;
                        frame.current.height = height;
                        frame.current.translate = drag.beforeTranslate;
                        renderFrame();
                    }}
                    onResizeEnd={saveToParent}

                    /* Rotate Events */
                    onRotateStart={({ set }) => {
                        set(frame.current.rotate);
                    }}
                    onRotate={({ beforeRotate }) => {
                        frame.current.rotate = beforeRotate;
                        renderFrame();
                    }}
                    onRotateEnd={saveToParent}
                />
            )}

            <InteractionModal
                open={interactionModalOpen}
                onCancel={() => setInteractionModalOpen(false)}
                onSave={saveInteraction}
                initialData={item.interaction}
                pages={Allpages}
            />

            <AnimationDrawer
                open={animationDrawerOpen}
                onClose={() => setAnimationDrawerOpen(false)}
                onSave={saveAnimation}
                initialData={item.animations}
            />
        </>
    );
}