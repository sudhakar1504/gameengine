"use client"
import React, { useEffect, useRef, useState } from "react";
import Moveable from "react-moveable";
import { Popover } from "antd";
import InteractionModal from "../InteractionModal";
import AnimationDrawer from "../AnimationDrawer";
import useStoreconfig from "@/store";


export default function DraggableBox({ item, index }: any) {
    const { editor, updateEditor, setSelectedElementId, setElementIndex, setInteractionsData } = useStoreconfig();
    const Data = editor?.elementsList;
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
        let duplicate = [...Data];
        let currentZIndex = duplicate[index].zIndex || 1;
        if (direction === "front") {
            const maxZIndex = Math.max(...duplicate.map((i: any) => i.zIndex || 1));
            duplicate[index].zIndex = maxZIndex + 1;
        } else {
            const minZIndex = Math.min(...duplicate.map((i: any) => i.zIndex || 1));
            duplicate[index].zIndex = minZIndex - 1;
        }
        updateEditor(duplicate);
        setOpen(false);
    }

    const deleteItem = () => {
        let duplicate = [...Data];
        duplicate.splice(index, 1);
        updateEditor(duplicate);
        setOpen(false);
    }

    const handleInteraction = () => {
        // setInteractionModalOpen(true);
        // setOpen(false);
        setElementIndex(index);
        setInteractionsData(item.interaction);
    }

    const saveInteraction = (interactionData: any) => {
        let duplicate = [...Data];
        duplicate[index] = {
            ...duplicate[index],
            interaction: interactionData
        };
        updateEditor(duplicate);
        setInteractionModalOpen(false);
    }

    const handleAnimation = () => {
        setAnimationDrawerOpen(true);
        setOpen(false);
    }

    const saveAnimation = (animationData: any) => {
        let duplicate = [...Data];
        duplicate[index] = {
            ...duplicate[index],
            animations: animationData
        };
        updateEditor(duplicate);
        // setAnimationDrawerOpen(false);
    }

    // Check if this element is part of the multi-selection
    const isMultiSelected = editor?.selectedElementIds?.includes(item.id);
    const isSelected = editor?.selectedElementId === item.id || isMultiSelected;

    const ungroupItem = () => {
        if (item.type !== 'group' || !item.children) return;

        const parent = targetRef.current?.parentElement;
        if (!parent) return;

        const parentWidth = parent.clientWidth;
        const parentHeight = parent.clientHeight;

        // Group's current absolute position/size
        // We use the frame.current because it tracks the latest drag state
        // However frame.current is in pixels (translate x/y, width/height)

        // Actually, frame.current is synced from props in useEffect. 
        // If we haven't dragged, it's correct. If we have dragged, it's correct.

        const groupX = frame.current.translate[0];
        const groupY = frame.current.translate[1];
        const groupW = frame.current.width;
        const groupH = frame.current.height;

        const newItems = item.children.map((child: any) => {
            // child.coords are % relative to group

            const childW_px = (child.coords.width / 100) * groupW;
            const childH_px = (child.coords.height / 100) * groupH;
            const childX_relative_px = (child.coords.x / 100) * groupW;
            const childY_relative_px = (child.coords.y / 100) * groupH;

            const childX_absolute = groupX + childX_relative_px;
            const childY_absolute = groupY + childY_relative_px;

            return {
                ...child,
                id: Date.now() + Math.random(), // Ensure unique ID
                coords: {
                    x: (childX_absolute / parentWidth) * 100,
                    y: (childY_absolute / parentHeight) * 100,
                    width: (childW_px / parentWidth) * 100,
                    height: (childH_px / parentHeight) * 100,
                    angle: (item.coords.angle || 0) + (child.coords.angle || 0) // Simple angle addition
                }
            };
        });

        let duplicate = [...Data];
        duplicate.splice(index, 1, ...newItems);
        updateEditor(duplicate);
        setOpen(false);
    };

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
            {item.type === 'group' && (
                <button onClick={ungroupItem} className="hover:bg-gray-100 px-2 py-1 rounded text-left">
                    Ungroup
                </button>
            )}
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

        let duplicate = [...Data];
        // If we are just moving a single item that happens to be in a multi-selection, 
        // we might want to move ALL selected items. 
        // BUT for now, let's assume the user drags the specific item or the group.
        // Implementing multi-drag is complex. 
        // If this is a group, we just update the group.

        duplicate[index] = {
            ...duplicate[index],
            coords: {
                ...duplicate[index].coords,
                x: (finalFrame.translate[0] / parentWidth) * 100,
                y: (finalFrame.translate[1] / parentHeight) * 100,
                width: (finalFrame.width / parentWidth) * 100,
                height: (finalFrame.height / parentHeight) * 100,
                angle: finalFrame.rotate
            }
        };
        updateEditor(duplicate);
    }

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
                    onClick={(e) => {
                        e.stopPropagation();
                        // If shift key is pressed, toggle selection (future improvement)
                        // For now just set as selected
                        if (!isMultiSelected) {
                            setSelectedElementId(item.id);
                        }
                    }}
                    style={{
                        position: "absolute",
                        zIndex: item?.zIndex || 1,
                        cursor: "move",
                        border: isSelected ? "2px solid #1890ff" : "1px solid transparent", // thicker border for visibility
                        boxSizing: "border-box",
                    }}
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
                                        {child.type === 'text' && <div style={{ ...child.font, fontSize: `${(child.font?.fontSize / 100) * (targetRef.current?.parentElement?.clientWidth || 1000)}vw` }}>{child.text}</div>}
                                        {/* Note: Font size in groups might need scaling logic or be simpler */}
                                    </div>
                                ))}
                            </div>
                        )}

                        {item.type === 'img' && <img
                            loading="lazy"
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

            {/* <InteractionModal
                open={interactionModalOpen}
                onCancel={() => setInteractionModalOpen(false)}
                onSave={saveInteraction}
                initialData={item.interaction}
            /> */}

            <AnimationDrawer
                open={animationDrawerOpen}
                onClose={() => setAnimationDrawerOpen(false)}
                onSave={saveAnimation}
                initialData={item.animations}
            />
        </>
    );
}