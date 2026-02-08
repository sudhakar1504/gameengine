"use client"
import { useEffect, useRef, useState } from "react";
import interact from "interactjs";
import { Popover } from "antd";

export default function DraggableBox({ item, setData, Data, index, SelectedID, setSelectedID }: any) {
    const boxRef = useRef<any>(null);
    const rotateRef = useRef(null);
    const [Open, setOpen] = useState(false);

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

    const content = (
        <div className="flex flex-col gap-2">
            <button onClick={() => changeZIndex("front")} className="hover:bg-gray-100 px-2 py-1 rounded text-left">
                Bring to Front
            </button>
            <button onClick={() => changeZIndex("back")} className="hover:bg-gray-100 px-2 py-1 rounded text-left">
                Push to Back
            </button>
        </div>
    );

    useEffect(() => {
        const element: any = boxRef.current;
        const rotateElement = rotateRef.current;
        const parent = boxRef.current?.parentElement;

        if (!parent) return;

        const parentWidth = parent.clientWidth;
        const parentHeight = parent.clientHeight;

        // Initialize position from props (assuming props are in %)
        // Convert % to pixels for interact.js handling
        let position = {
            x: (item.coords.x / 100) * parentWidth,
            y: (item.coords.y / 100) * parentHeight,
            angle: item.coords.angle,
            width: (item.coords.width / 100) * parentWidth,
            height: (item.coords.height / 100) * parentHeight
        };

        function updateTransform() {
            // Convert pixels back to % for storage
            const xPct = (position.x / parentWidth) * 100;
            const yPct = (position.y / parentHeight) * 100;
            const wPct = (position.width / parentWidth) * 100;
            const hPct = (position.height / parentHeight) * 100;

            setData((prevData: any) => {
                const newData = [...prevData];
                newData[index] = {
                    ...newData[index],
                    coords: {
                        ...newData[index].coords,
                        x: xPct,
                        y: yPct,
                        angle: position.angle,
                        width: wPct,
                        height: hPct
                    }
                };
                return newData;
            });

            element.style.width = `${position.width}px`;
            element.style.height = `${position.height}px`;
            element.style.transform =
                `translate(${position.x}px, ${position.y}px) rotate(${position.angle}deg)`;
        }

        // Initial render update
        element.style.width = `${position.width}px`;
        element.style.height = `${position.height}px`;
        element.style.transform = `translate(${position.x}px, ${position.y}px) rotate(${position.angle}deg)`;


        interact(element as any)
            .draggable({
                modifiers: [
                    // interact.modifiers.restrictRect({
                    //     restriction: '#slideview',
                    //     endOnly: false,
                    // })
                ],
                listeners: {
                    move(event) {
                        position.x += event.dx;
                        position.y += event.dy;
                        updateTransform();
                    },
                    end(event) {
                        updateTransform();
                    }
                }
            })
            .resizable({
                modifiers: [
                    // interact.modifiers.restrictEdges({
                    //     outer: "#slideview"
                    // }),
                    interact.modifiers.restrictSize({
                        min: { width: 20, height: 20 }
                    })
                ],
                edges: { left: true, right: true, bottom: true, top: true },
                listeners: {
                    move(event) {
                        // update local position state 
                        let { x, y } = position;

                        x += event.deltaRect.left;
                        y += event.deltaRect.top;

                        position.width = event.rect.width;
                        position.height = event.rect.height;
                        position.x = x;
                        position.y = y;

                        updateTransform();
                    },
                    end(event) {
                        updateTransform();
                    }
                }
            });

        // Rotation Handle Logic
        interact(rotateElement as any)
            .draggable({
                onstart(event) {
                    const rect = element.getBoundingClientRect();

                    // Store center point
                    const center = {
                        x: rect.left + rect.width / 2,
                        y: rect.top + rect.height / 2
                    };

                    event.interactable.context.center = center;
                },
                onmove(event) {
                    const center = event.interactable.context.center;

                    const angle = Math.atan2(
                        event.client.y - center.y,
                        event.client.x - center.x
                    );

                    // Convert radians to degrees and add 90 degrees because handle is at top
                    position.angle = (angle * 180 / Math.PI) + 90;

                    updateTransform();
                }
            });
        updateTransform()
        // Clean up
        return () => {
            interact(element as any).unset();
            interact(rotateElement as any).unset();
        };
    }, []);

    return (
        <Popover
            content={content}
            title="Arrange"
            trigger="contextMenu"
            open={Open}
            onOpenChange={setOpen}
        >
            <div
                key={item.id}
                ref={boxRef}
                className="draggable"
                onClick={() => {
                    setSelectedID(item.id);
                }}
                contentEditable={item.type === 'text' ? true : false}
                suppressContentEditableWarning
                style={{
                    width: `${item.coords.width}%`,
                    height: `${item.coords.height}%`,
                    // border: "2px solid #333",
                    // display: "flex",
                    // alignItems: "center",
                    // justifyContent: "center",
                    userSelect: "none",
                    position: "absolute",
                    // background: "#f9f9f9",
                    touchAction: "none", // Prevent default touch actions
                    boxSizing: 'border-box', // Ensure border doesn't mess up sizing
                    zIndex: item.zIndex || 1
                }}
            >

                {item.type === 'img' && <img src={item.src} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />}
                {item.type === 'text' && <div style={{ ...item.font, fontSize: `${(item.font?.fontSize / 100) * boxRef.current?.parentElement?.clientWidth}vw` }}>{item.text}</div>}

                {/* Rotation Handle */}
                <div
                    ref={rotateRef}
                    style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        position: 'absolute',
                        top: '-30px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        cursor: 'grab',
                        opacity: 0.5
                    }}
                >
                    <i className="fa-solid fa-rotate"></i>
                </div>
            </div>
        </Popover>
    );
}
