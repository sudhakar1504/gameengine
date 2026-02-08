"use client"
import React, { useCallback, useState } from 'react'
import { useDrop } from 'react-dnd'
import { Box } from './box'

import { CustomDragLayer } from './CustomDragLayer'

const Click1 = () => {
    const [boxes, setBoxes] = useState<any>({
        a: { top: 20, left: 80, title: 'Drag me around' },
        b: { top: 180, left: 20, title: 'Drag me too' },
    })
    const moveBox = useCallback(
        (id: any, left: any, top: any) => {
            setBoxes((prev: any) => {
                return {
                    ...prev,
                    [id]: { ...prev[id], left, top },
                }
            })
        },
        [boxes, setBoxes],
    )
    const [, drop] = useDrop(
        () => ({
            accept: 'box',
            drop(item: any, monitor: any) {
                const delta = monitor.getDifferenceFromInitialOffset()
                const left = Math.round(item.left + delta.x)
                const top = Math.round(item.top + delta.y)
                moveBox(item.id, left, top)
                return undefined
            },
        }),
        [moveBox],
    )
    return (
        <div ref={drop} style={{
            width: 300,
            height: 300,
            border: '1px solid black',
            position: 'relative',
        }}>
            <CustomDragLayer />
            {Object.keys(boxes).map((key) => {
                const { left, top, title } = boxes[key]
                return (
                    <Box
                        key={key}
                        id={key}
                        left={left}
                        top={top}
                        hideSourceOnDrag={true}
                        title={title}
                    >
                        {title}
                    </Box>
                )
            })}
        </div>
    )
}

export default Click1